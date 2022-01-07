const axios = require("axios");
const fs = require("fs/promises");

class Searches {
    history = [];
    dbPath = "./db/database.json";
    constructor() {
        this.readDB();
    }

    get historyCapitalize() {
        return this.history.map((el) => {
            let words = el.split(" ");
            words = words.map(
                (char) => char[0].toUpperCase() + char.substring(1)
            );
            return words.join(" ");
        });
    }

    async city(place = "") {
        try {
            // request http

            const instance = axios.create({
                baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${place}.json`,
                params: {
                    access_token: process.env.MAPBOX_KEY,
                    limit: 5,
                    language: "es",
                },
            });
            // const res = await axios.get(
            //     `https://api.mapbox.com/geocoding/v5/mapbox.places/${place}.json?language=es&access_token=${process.env.MAPBOX_KEY}`
            // );
            // );
            const res = await instance.get();

            return res.data.features.map((city) => {
                return {
                    id: city.id,
                    name: city.place_name,
                    longitud: city.center[0],
                    latitud: city.center[1],
                };
            });
            // gonna return the cities that gonna be equal to place as my parameter
        } catch (error) {
            return [];
        }
    }
    async weatherPlace(lat, lon) {
        try {
            const instance = axios.create({
                baseURL: `https://api.openweathermap.org/data/2.5/weather`,
                params: {
                    lat,
                    lon,
                    appid: process.env.OPENWEATHER_KEY,
                    units: "metric",
                    lang: "es",
                },
            });

            // const city = await axios.get(
            //     `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=12788c334d554bc735d04178ab4d17eb&units=metric&lang=es`
            // );

            const { data } = await instance.get();

            return {
                desc: data.weather[0].description,
                min: data.main.temp_min,
                max: data.main.temp_max,
                temp: data.main.temp,
            };
        } catch (error) {
            console.log(error);
        }
    }

    async addHistory(place = " ") {
        if (this.history.includes(place.toLocaleLowerCase())) return;
        this.history = this.history.splice(0, 5);
        this.history.unshift(place.toLocaleLowerCase());

        // save in db
        this.saveDB();
    }

    async saveDB() {
        const payload = {
            history: this.history,
        };

        await fs.writeFile(this.dbPath, JSON.stringify(payload), "utf-8");
    }
    async readDB() {
        try {
            const info = await fs.readFile(this.dbPath, "utf-8");
            this.history = await JSON.parse(info).history;
        } catch (error) {
            return [];
        }
    }
}

module.exports = Searches;
