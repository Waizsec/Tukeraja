import React, { useEffect, useState } from 'react'
import { arrowUpWhite, dummyDiagram } from '../assets'
import { Option, PredictGraph } from './components';
import { ReactTyped } from "react-typed";



const Predict = (props) => {
    const [selectedCurrency1, setSelectedCurrency1] = useState('USD');
    const [selectedCurrency2, setSelectedCurrency2] = useState('IDR');
    const [data, setData] = useState({
        currentValue: 0,
        date: null,
    });
    const [prediction, setPrediction] = useState({ interpretations: null, values: null });

    const handleCurrencyChange1 = (currency) => {
        setSelectedCurrency1(currency);
    };

    const handleCurrencyChange2 = (currency) => {
        setSelectedCurrency2(currency);
    };

    useEffect(() => {
        const fetchData = async (currency1, currency2) => {
            try {
                const url = `http://127.0.0.1:5000/?currency1=${currency1}&currency2=${currency2}`;
                const response = await fetch(url);
                if (response.ok) {
                    const data = await response.json();
                    setData(data); // Update the state with the fetched data
                } else {
                    console.error('Failed to fetch data');
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        // Fetch data with default values for currency1 and currency2 when component mounts
        fetchData(selectedCurrency1, selectedCurrency2);
    }, [selectedCurrency1, selectedCurrency2]); // Update data when either selectedCurrency1 or selectedCurrency2 changes

    const handlePredictClick = async () => {
        try {
            const days = document.getElementById("numberInput").value;
            const timestamp = new Date().getTime(); // Generate a unique timestamp
            const url = `http://127.0.0.1:5000/predict?days=${days}&currency1=${selectedCurrency1}&currency2=${selectedCurrency2}&timestamp=${timestamp}`;
            const response = await fetch(url);
            if (response.ok) {
                const result = await response.json();
                setPrediction(result); // Update the state with the fetched data
            } else {
                console.error('Failed to fetch prediction data');
            }
        } catch (error) {
            console.error('Error fetching prediction data:', error);
        }
    };
    useEffect(() => {
        handlePredictClick();
    }, []);

    console.log(prediction)


    return (
        <>
            <div className="w-[100vw] h-screen overflow-scroll">
                <div className={`w-[100vw] h-screen ${[4, 5].includes(props.paged) ? "show-page" : props.paged === 1 ? "show-page-firstime" : "animate-disappear"}`}>
                    {/* Header */}
                    <div className="w-[100vw] flex items-center justify-between py-[2vw] fixed top-0 z-10 bg-white">
                        <span className='font-semibold text-[2vw] ml-[4vw] cursor-pointer'>
                            Tukeraja<span className='text-[#EB4184]'>.</span></span>
                        <div className="flex items-center justify-center mr-[3vw] text-[1vw]">
                            <button onClick={() => props.handlePageChange(3)} className='mr-[2vw]'>Blogs</button>
                            <button onClick={() => props.handlePageChange(2)}>About</button>
                        </div>
                    </div>
                    <div className="h-[7vw]"></div>

                    {/* Bagian body nya */}
                    <div className="w-full flex px-[5vw]">
                        {/* Left Body Part */}
                        <div className="w-[35%] h-full flex justify-center py-[4vw] px-[0.8vw] relative flex-col">
                            <div className="relative animate-up-down">
                                <div className="gradient-pink w-full h-[12vw] rounded-[1vw]"></div>
                                <div className="absolute w-full top-[0.7vw] left-[1vw]">
                                    <div className="w-full h-[12vw] border-[0.1vw] border-white bg-white bg-opacity-10 backdrop-blur-md rounded-[1vw] shadow-lg p-[1.2vw]
                            text-white">
                                        <p className='text-[1vw]'>
                                            CURRENT EXCHANGE RATE
                                        </p>
                                        <p className='text-[1.7vw] flex items-center '>
                                            <span>{selectedCurrency1} 1</span>
                                            <img src={arrowUpWhite} className='rotate-90 w-[0.7vw] mx-[2vw]' />
                                            <span>{selectedCurrency2} {data.currentValue}</span>
                                        </p>
                                        <div className="h-[0.1vw] w-[30%] bg-white my-[0.5vw]"></div>
                                        <p className='text-[1vw] flex items-center'>
                                            <span className='ml-[0.4vw]'>{data.date}</span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <h2 className='text-[2vw] mt-[2vw] font-medium'>
                                Create Prediction 🧑🏻‍💻
                            </h2>
                            <p className='mt-[1vw] text-[1vw]  text-[#f6468a]'>Please insert days</p>
                            <input type="number" id="numberInput" min="1" max="10" placeholder='0' className='border-[0.1vw] p-[1vw] text-[1.2vw] mt-[1vw] rounded-[0.5vw] outline-none border-[#f35b95] h-[4vw] text-[#f6468a]' />
                            <div className="w-full flex justify-end">
                                <button type="button" onClick={handlePredictClick} className='mt-[0.7vw] w-[6vw] h-[2vw] border-[#f6468a] border-[0.1vw] rounded-[0.5vw] bg-[#f35b95] text-white hover:w-[7vw] duration-[0.5s] text-[1vw]'>
                                    Predict
                                </button>
                            </div>
                        </div>
                        {/* End Left Body Part */}


                        {/* Right Body Part */}
                        <div className="w-[65%] py-[4vw] px-[5vw]">
                            {/* Currency Optio */}
                            <Option
                                selectedCurrency1={selectedCurrency1}
                                selectedCurrency2={selectedCurrency2}
                                onCurrencyChange1={handleCurrencyChange1}
                                onCurrencyChange2={handleCurrencyChange2}
                                currentValue={data.currentValue}
                            />


                            {prediction.values !== null ? (
                                <>
                                    <h2 className='text-[2vw] font-medium mt-[0.8vw] mt-[1vw]'>
                                        Exchange Rate Diagrams 📈
                                    </h2>
                                    <div className="ml-[-1vw]">
                                        <PredictGraph prediction={prediction.values} />
                                    </div>
                                    <p className='text-[1vw] text-[#3a3a3a]'>
                                        <b>Interpretation 📝 :</b>
                                        <ReactTyped
                                            strings={[prediction.interpretation]}
                                            typeSpeed={20}
                                            backSpeed={20}
                                            loop={false}
                                        />
                                    </p>
                                </>
                            ) : (
                                <h2 className='text-[2vw] font-medium mt-[0.8vw] mt-[2vw]'>
                                    Let's make some prediction!
                                </h2>
                            )}

                            {/* Penjelasan diagram */}

                        </div>
                        {/* End Right Body Part */}
                    </div>
                </div >
            </div>

        </>
    )
}

export default Predict