let historys='';

let tempSymb="<sup>0</sup>C";
let windSymb="kmh<sup>-1</sup>";

let tempSymb2="<sup>0</sup>f";
let windSymb2="ms<sup>-1</sup>";

let ifEnderd=0;
let ifEnderd2=1;

searchCity()

function changSymbol(){
    let e=tempSymb;
    tempSymb=tempSymb2;
    tempSymb2=e;

    let e2=windSymb;
    windSymb=windSymb2;
    windSymb2=e2;

    let e3=ifEnderd;
    ifEnderd=ifEnderd2;
    ifEnderd2=e3;

    searchCity()
}

async function searchCity(){
    historys='';
    let cityName=document.getElementById('cityName').value;

    if (!cityName) {
        cityName = "London";   
    }

    const currentWeather = "http://api.weatherapi.com/v1/current.json?key=6dd4c35c1b974728993102844240110&q="+cityName+"&aqi=no";

        try {
            const response = await fetch(currentWeather);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json(); 
            const weatherIcon = data.current.condition.icon; // Get the icon URL
            document.getElementById('weather-icon').src = weatherIcon; 
           // console.log(data);
                    

            document.getElementById('nowLocation').innerHTML="Location  :   "+(data.location.name);
            //document.getElementById('weatherIcon').innerHTML=`<img src='//cdn.weatherapi.com/weather/64x64/day/296.png' alt="Weather data by WeatherAPI.com" border="0">`;
            document.getElementById('nowHumidity').innerHTML="Humidity  :   "+data.current.humidity;

            if(ifEnderd==0){
                document.getElementById('nowWind').innerHTML="Wind Speed  :   "+data.current.wind_kph+windSymb;
                document.getElementById('nowTemperature').innerHTML="Temperature  :   "+data.current.temp_c+tempSymb;
            }else{
                document.getElementById('nowWind').innerHTML="Wind Speed  :   "+data.current.wind_mph+windSymb;
                document.getElementById('nowTemperature').innerHTML="Temperature  :   "+data.current.temp_f+tempSymb;
            }

            const dateAndTime =data.location.localtime;

            function getPreviousDays(dateAndTime) {
                const date = new Date(dateAndTime);
                const previousDays = [];
                
                for (let i = 1; i <= 6; i++) {
                    const previousDate = new Date(date);
                    previousDate.setDate(date.getDate() - i);
                    
                    const formattedDate = previousDate.toISOString().split('T')[0];
                    previousDays.push(formattedDate);
                }
                
                return previousDays;
            }
            

            const historyDays = getPreviousDays(dateAndTime);
            //console.log(historyDays);


            historyDays.forEach(date => {
                getHistoryData(date,cityName);
            });
            

        } catch (error) {
            console.error('Error fetching data:', error);
        }


        let futureWeather = "http://api.weatherapi.com/v1/forecast.json?key=6dd4c35c1b974728993102844240110&q="+cityName+"&days=1&aqi=no&alerts=no"

        try {
            const response = await fetch(futureWeather)
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }
            
            const data2 = await response.json()  
            //console.log(data2.current.condition.text);
            
            document.getElementById('futureWeather').innerHTML=(data2.current.condition.text);
    
        } catch (error) {

            alert("The location entered is incorrect");

            console.error('Error fetching data detect :', error);
        }


}

async function getHistoryData(date,cityName){
    //console.log(cityName);
    
    let historyWeather = "http://api.weatherapi.com/v1/history.json?key=6dd4c35c1b974728993102844240110&q="+cityName+"&dt="+date+""

    try {
        const response = await fetch(historyWeather)
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
        }
        
        const data = await response.json()  
        //console.log(data);
        
        setHistoryDate(data);

    } catch (error) {
        console.error('Error fetching data:', error);
    }



}



function setHistoryDate(historyData){
    //console.log(historyData);

    let icon=historyData.forecast.forecastday[0].day.condition.icon;
    let date=historyData.forecast.forecastday[0].date
    let humidity=historyData.forecast.forecastday[0].day.avghumidity
    let temp;
    let wind;

    if(ifEnderd==0){
         temp=historyData.forecast.forecastday[0].day.avgtemp_c
         wind=historyData.forecast.forecastday[0].day.avgvis_km
    }else{
        temp=historyData.forecast.forecastday[0].day.avgtemp_f
        wind=historyData.forecast.forecastday[0].day.avgvis_miles

    }
    


    //console.log(date,temp,wind,humidity);
    

    historys+=
            `<li>
                <div class="card text-bg-secondary mb-3 " style="max-width: 18rem;">
                    <div "card-header">
                        <h4>${date}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<img src="${icon}" alt="Icon"></h4>
                         
                    </div>
                    <div "card-body">
                        <div class="data">
                            <h6 >&nbsp  Temperature : ${temp} ${tempSymb}</h6>
                            <h6 >&nbsp  Wind Speed  : ${wind} ${windSymb}</h6>
                            <h6 >&nbsp  Humidity    : ${humidity}</h6>
                        </div>
                    </div>
                </div>
            </li>
             `        


    document.getElementById('historys').innerHTML=historys;


}

const toggleButton = document.getElementById('toggleButton');
const body = document.body;

toggleButton.addEventListener('click', () => {
  if (body.classList.contains('light')) {
    body.classList.remove('light');
    body.classList.add('dark');
    toggleButton.textContent = 'Light';
  } else {
    body.classList.remove('dark');
    body.classList.add('light');
    toggleButton.textContent = 'Dark';
  }
});



