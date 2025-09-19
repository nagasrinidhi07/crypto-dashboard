import React, { useEffect, useContext, useState } from 'react';
import './Coin.css';
import { useParams } from 'react-router-dom';
import { CoinContext } from '../../context/CoinContext';
import LineChart from '../../components/LineChart/LineChart';

const Coin = () => {
  const { coinId } = useParams();
  const [coinData, setCoinData] = useState(null);
  const [historicalData, setHistoricalData] = useState(null);
  const { currency } = useContext(CoinContext);
  const [darkMode, setDarkMode] = useState(false);

  // Toggle theme
  const toggleTheme = () => setDarkMode(prev => !prev);

  // Fetch coin data
  const fetchCoinData = async () => {
    try {
      const res = await fetch(
        `https://api.coingecko.com/api/v3/coins/${coinId}`,
        { headers: { accept: 'application/json' } }
      );
      const data = await res.json();
      setCoinData(data);
    } catch (err) {
      console.error('Error fetching coin data:', err);
    }
  };

  // Fetch historical data
  const fetchHistoricalData = async () => {
    try {
      const res = await fetch(
        `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=${currency.name.toLowerCase()}&days=12&interval=daily`,
        { headers: { accept: 'application/json' } }
      );
      const data = await res.json();
      setHistoricalData(data);
    } catch (err) {
      console.error('Error fetching historical data:', err);
    }
  };

  useEffect(() => {
    fetchCoinData();
    fetchHistoricalData();
  }, [currency, coinId]);

  if (!coinData || !historicalData) {
    return (
      <div className="spinner">
        <div className="spin"></div>
      </div>
    );
  }

  const currencyKey = currency.name?.toLowerCase();
  const coinImage = coinData?.image?.large || '';
  const coinName = coinData?.name || 'Unknown';
  const coinSymbol = coinData?.symbol?.toUpperCase() || '';
  const marketRank = coinData?.market_cap_rank ?? 'N/A';
  const currentPrice = coinData?.market_data?.current_price?.[currencyKey]?.toLocaleString() || 'N/A';
  const marketCap = coinData?.market_data?.market_cap?.[currencyKey]?.toLocaleString() || 'N/A';
  const hourHigh = coinData?.market_data?.high_24h?.[currencyKey]?.toLocaleString() || 'N/A';
  const hourLow = coinData?.market_data?.low_24h?.[currencyKey]?.toLocaleString() || 'N/A';
  const priceChange24h = coinData?.market_data?.price_change_percentage_24h?.toFixed(2) || 'N/A';

  return (
    <div className={`coin ${darkMode ? 'dark-theme' : ''}`}>
      {/* Theme Toggle */}
      <div className="theme-toggle">
        <button onClick={toggleTheme}>
          {darkMode ? 'Switch to Light 🌞' : 'Switch to Dark 🌙'}
        </button>
      </div>

      {/* Coin Title */}
      <div className="coin-name">
        <img src={coinImage} alt={coinName} />
        <p>
          <b>{coinName} ({coinSymbol})</b>
        </p>
      </div>

      {/* Chart + Info */}
      <div className="coin-content">
        {/* Line Chart */}
        <div className="coin-chart">
          <LineChart historicalData={historicalData} darkMode={darkMode} />
        </div>

        {/* Info Section */}
        <div className="coin-info">
          {[
            { label: 'Crypto Market Rank', value: marketRank },
            { label: 'Current Price', value: `${currency.symbol} ${currentPrice}` },
            { label: 'Market Cap', value: `${currency.symbol} ${marketCap}` },
            { label: '24h High', value: `${currency.symbol} ${hourHigh}` },
            { label: '24h Low', value: `${currency.symbol} ${hourLow}` },
            { label: '24h Price Change', value: `${priceChange24h}%` },
          ].map((item, idx) => (
            <ul key={idx}>
              <li>{item.label}</li>
              <li>{item.value}</li>
            </ul>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Coin;
