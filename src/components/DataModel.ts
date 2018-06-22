export interface Timezone {
	timezone: string,
	offset: number
}

export interface Weather {
	time: number,
	summary: string,
	icon: string,
	nearestStormDistance: number,
	precipIntensity: number,
	precipIntensityMax: number,
	precipIntensityMaxTime: number,
	precipProbability: number,
	precipType: string,
	temperature: number,
	apparentTemperature: number,
	temperatureHigh: number,
	temperatureHighTime: number,
	temperatureLow: number,
	temperatureLowTime: number,
	apparentTemperatureHigh: number,
	apparentTemperatureHighTime: number,
	apparentTemperatureLow: number,
	apparentTemperatureLowTime: number,
	dewPoint: number,
	humidity: number,
	pressure: number,
	windSpeed: number,
	windGust: number,
	cloudCover: number,
	uvIndex: number,
	visibility: number
}

export interface Forecast {
	latitude: number,
	longitude: number,
	timezone: string,
	currently: Weather,
	minutely: {
		summary: string,
		icon: string,
		data: Weather[],
	}
	hourly: {
		summary: string,
		icon: string,
		data: Weather[]
	},
	daily: {
		summary: string,
		icon: string,
		data: Weather[]
	}
	flags: Object,
	offset: number
}
