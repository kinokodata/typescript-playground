// Chart.jsの型定義のみを宣言
declare const Chart: {
    new (canvas: HTMLCanvasElement, config: any): any;
};

interface WeatherResponse {
    latitude: number;
    longitude: number;
    generationtime_ms: number;
    utc_offset_seconds: number;
    timezone: string;
    timezone_abbreviation: string;
    elevation: number;
    daily_units: {
        time: string;
        temperature_2m_max: string;
    };
    daily: {
        time: string[];
        temperature_2m_max: number[];
    };
}

fetch('https://api.open-meteo.com/v1/forecast?latitude=35.6785&longitude=139.6823&daily=temperature_2m_max&timezone=Asia%2FTokyo')
    .then(function(response) {
        return response.json();
    })
    .then(function(data: WeatherResponse) {
        console.log("データが取得できました");
        console.log(data);

        const labels: string[] = data.daily.time.map(time => {
            const date = new Date(time);
            return `${date.getMonth() + 1}/${date.getDate()}`;
        });

        new Chart(
            document.getElementById('temperatureChart') as HTMLCanvasElement,
            {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [{
                        label: '気温（℃）',
                        data: data.daily.temperature_2m_max,
                        borderColor: 'rgb(75, 192, 192)',
                        tension: 0.1
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        title: {
                            display: true,
                            text: '1週間の予想最高気温'
                        }
                    },
                    scales: {
                        y: {
                            title: {
                                display: true,
                                text: '気温（℃）'
                            }
                        }
                    }
                }
            }
        );
    })
    .catch(function(error: Error) {
        console.log("データの取得に失敗しました");
        console.log(error);
    });