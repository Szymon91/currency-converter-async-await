const axios = require('axios');

const getExchangeRate = async (fromCurrency, toCurrency) => {

    const response = await axios.get('https://api.exchangeratesapi.io/latest?base=PLN');

    try {
        const rate = response.data.rates;
        const exchangeRate = (rate[toCurrency] / rate[fromCurrency]);

        return exchangeRate;
    } catch (error) {
        throw new Error( `Unable to get currency ${fromCurrency} and ${toCurrency}.`);
    }
}

const getCountries = async (toCurrency) => {
    try {
        const response = await axios.get(`https://restcountries.eu/rest/v2/currency/${toCurrency}`);

        return response.data.map(country => country.name);
    } catch (error) {
        throw new Error( `Unable to get countries that use ${toCurrency}.`);
    }
}

const convertCurrency = async (fromCurrency, toCurrency, amount) => {
    let exchangeRate;
    let countries;
  
    await Promise.all([getExchangeRate(fromCurrency, toCurrency), getCountries(toCurrency)])
      .then(([exchangeRateValue, countriesValue]) => {
        exchangeRate = exchangeRateValue;
        countries = countriesValue;
      });

    const convertedAmount = (amount * exchangeRate).toFixed(2);

    return `${amount} ${fromCurrency} is worth ${convertedAmount} ${toCurrency}. You can spent these in the following countries: ${countries}.`
}

convertCurrency('USD', 'PLN', 100)
    .then((message) => {
        console.log(message);
    }).catch((error) => {
        console.log(error.message);
    })