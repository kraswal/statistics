import jsonGenerator from "./jsonGenerator.js";

/**
 * Число для округления дробного числа.
 */
const NUMBER_ROUND = 1;

/**
 * Помощник для подведения статистики
 */
export default class StatHelper {
    static getStats(jsonTickets) {
        let stats = calculateStats(jsonTickets);
        const jsonStats = JSON.stringify(stats);

        stats = null;                               // Сборка мусора
        clearAirplanes(jsonTickets);

        return jsonStats;
    }
}

/**
 * Вычисляет статистику по рейсу
 * @param {String} jsonTickets JSON запись с билетами
 * @returns Массив со статистикой
 */
function calculateStats(jsonTickets) {
    const stats = [];

    for (let flight of jsonGenerator.flights){
        const [getLoad, getLuggageLoad] = calculateLoad(flight, jsonTickets);
        stats.push(
            {
                flightNumber: flight.flightNumber,
                load: getLoad(),
                luggageLoad: getLuggageLoad(),
            }
        );
    }
    return stats;
}

/**
 * Вычисляет % загруженности и мест с багажом
 * @param {Flight} flight Рейс
 * @param {String} jsonTickets JSON запись с билетами
 * @returns Массив с функциями для изъятия данных
 */
function calculateLoad(flight, jsonTickets) {
    const tickets = JSON.parse(jsonTickets);
    let busySeats = 0;
    let luggageSeats = 0;

    /**
     * Получает загруженность по местам
     * @returns Загруженность по местам
     */
    function getLoad() {
        for (let ticket of tickets){
            if (ticket.flight.flightNumber == flight.flightNumber){
                busySeats++;
            }
        }
        const load = busySeats / flight.seats * 100;
        return load.toFixed(NUMBER_ROUND) + '%';
    }

    /**
     * Получает % мест с багажом
     * @returns % мест с багажом
     */
    function getLuggageLoad() {
        for (let ticket of tickets){
            if (ticket.flight.flightNumber == flight.flightNumber){
                if (ticket.hasLuggage) {
                    luggageSeats++;
                }
            }
        }
        const luggageLoad =  luggageSeats / busySeats * 100;
        return luggageLoad.toFixed(NUMBER_ROUND) + '%';
    }

    return [getLoad, getLuggageLoad]
}
// ЗАМЫКАНИЕ!!!

/**
 * Отчищает рейс от занятых мест
 */
function clearAirplanes() {
    for (let flight of jsonGenerator.flights){
        flight.busySeats = 0;
    }
}