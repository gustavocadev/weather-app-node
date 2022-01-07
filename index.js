const {
    readInput,
    inquirerMenu,
    pause,
    listPlaces,
} = require("./helpers/inquirer");
require("dotenv").config();

const Searches = require("./models/searches");

const main = async () => {
    let option = "";

    const searches = new Searches();
    do {
        option = await inquirerMenu();

        if (option === 1) {
            // show messages
            const cityToSearch = await readInput("Ciudad: ");

            //Search the places
            const places = await searches.city(cityToSearch);

            // select place
            const idSelected = await listPlaces(places);

            if (idSelected === "0") continue;

            const placeSelected = places.find(
                (place) => place.id === idSelected
            );

            // save db
            searches.addHistory(placeSelected.name);

            const { name, longitud, latitud } = placeSelected;

            // Clima data

            const { temp, min, max, desc } = await searches.weatherPlace(
                latitud,
                longitud
            );
            // show results
            console.log("\ninformacion de la ciudad\n".yellow);
            console.log("Ciudad:", name);
            console.log("Latitud:", latitud);
            console.log("Lgn:", longitud);
            console.log("Tempreratura:", temp);
            console.log("Minima:", min);
            console.log("Maxima:", max);
            console.log("Como está el clima:", desc);
        }

        if (option === 2) {
            console.log("\n Tu historial es:");
            searches.historyCapitalize.forEach((place, idx) => {
                console.log(`${`${idx + 1}`.yellow} ${place}`);
            });
        }

        if (option !== 0) await pause();
    } while (option !== 0);
};

main();
