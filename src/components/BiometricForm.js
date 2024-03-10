import React, {useState, useEffect, useContext} from 'react';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry';
import { getAllUsers } from '../data/Users';
import {FaCheckCircle} from "react-icons/fa";
import {Helmet} from "react-helmet";
import darkLogo from '../icons/dark-logo.png';
import {TrackContext} from "./TrackContext";

const genderOptions = [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
    { value: 'nonBinary', label: 'Non-Binary' },
    { value: 'transgender', label: 'Transgender' },
    { value: 'intersex', label: 'Intersex' },
    { value: 'other', label: 'Other' },
    { value: 'preferNotToSay', label: 'Prefer not to say' },
];

const nationalityOptions = [
    { value: 'german', label: 'German' },
    { value: 'american', label: 'American' },
    { value: 'canadian', label: 'Canadian' },
    { value: 'british', label: 'British' },
    { value: 'french', label: 'French' },
    // Additional common nationalities
    { value: 'indian', label: 'Indian' },
    { value: 'chinese', label: 'Chinese' },
    { value: 'japanese', label: 'Japanese' },
    { value: 'russian', label: 'Russian' },
    { value: 'brazilian', label: 'Brazilian' },
    // Add many more as needed
];

const ethnicityOptions = [
    { value: 'caucasian', label: 'Caucasian' },
    { value: 'africanAmerican', label: 'African American' },
    { value: 'hispanic', label: 'Hispanic' },
    { value: 'asian', label: 'Asian' },
    { value: 'nativeAmerican', label: 'Native American' },
    // Additional common ethnicities
    { value: 'middleEastern', label: 'Middle Eastern' },
    { value: 'southAsian', label: 'South Asian' },
    { value: 'southeastAsian', label: 'Southeast Asian' },
    { value: 'pacificIslander', label: 'Pacific Islander' },
    { value: 'indigenousAustralian', label: 'Indigenous Australian' },
    // Add many more as needed
];

const languageOptions = [
    { value: 'english', label: 'English' },
    { value: 'spanish', label: 'Spanish' },
    { value: 'french', label: 'French' },
    { value: 'german', label: 'German' },
    { value: 'chinese', label: 'Chinese' },
    // Add more languages as needed
];

const exerciseFrequencyOptions = [
    { value: 'none', label: 'None' },
    { value: 'low', label: 'Low' },
    { value: 'moderate', label: 'Moderate' },
    { value: 'high', label: 'High' },
];

const dietOptions = [
    { value: 'balanced', label: 'Balanced' },
    { value: 'vegetarian', label: 'Vegetarian' },
    { value: 'vegan', label: 'Vegan' },
    { value: 'other', label: 'Other' },
];

const sleepPatternsOptions = [
    { value: 'regular', label: 'Regular' },
    { value: 'irregular', label: 'Irregular' },
    { value: 'variable', label: 'Variable' },
];

const alcoholConsumptionOptions = [
    { value: 'none', label: 'None' },
    { value: 'low', label: 'Low' },
    { value: 'moderate', label: 'Moderate' },
    { value: 'high', label: 'High' },
];

const getCustomStyles = (isDarkMode) => ({
    control: (provided) => ({
        ...provided,
        backgroundColor: isDarkMode ? 'rgb(33, 37, 41)' : 'white',
        borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)',
        color: isDarkMode ? 'white' : 'black',
        boxShadow: isDarkMode ? '0 0 0 1px rgba(255, 255, 255, 0.2)' : '0 0 0 1px rgba(0, 0, 0, 0.1)',
        '&:hover': {
            borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.2)',
        },
        width: '100%', // Sets the width of the Select to fit its container
    }),
    input: (styles) => ({
        ...styles,
        color: isDarkMode ? 'white' : 'black',
    }),
    singleValue: (provided) => ({
        ...provided,
        color: isDarkMode ? 'white' : 'black',
    }),
    menu: (provided) => ({
        ...provided,
        backgroundColor: isDarkMode ? 'rgb(33, 37, 41)' : 'white',
        color: isDarkMode ? 'white' : 'black',
    }),
    menuList: (provided) => ({
        ...provided,
        maxHeight: '15vh',
        backgroundColor: isDarkMode ? 'rgb(33, 37, 41)' : 'white',
    }),
    option: (provided, state) => ({
        ...provided,
        backgroundColor: state.isFocused
            ? isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'
            : isDarkMode ? 'rgb(33, 37, 41)' : 'white',
        color: isDarkMode ? 'white' : 'black',
        '&:active': {
            backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)',
        },
    }),
    multiValue: (styles) => ({
        ...styles,
        backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
    }),
    multiValueLabel: (styles) => ({
        ...styles,
        color: isDarkMode ? 'white' : 'black',
    }),
    multiValueRemove: (styles) => ({
        ...styles,
        color: isDarkMode ? 'white' : 'black',
        '&:hover': {
            backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.2)',
            color: 'white',
        },
    }),
});

const BiometricForm = () => {
    const [isDarkMode, setIsDarkMode] = useState(false);

    // name details
    const [firstName, setFirstName] = useState(null);
    const [lastName, setLastName] = useState(null);
    const [userId, setUserId] = useState(null);

    // State hooks for each Select component
    const [heartRate, setHeartRate] = useState(null);
    const [breathingRate, setBreathingRate] = useState(null);
    const [bvp, setBvp] = useState(null);
    const [emg, setEmg] = useState(null);
    const [skinTemp, setSkinTemp] = useState(null);
    const [hrv, setHrv] = useState(null);

    const [selectedNationality, setSelectedNationality] = useState(null);
    const [selectedEthnicity, setSelectedEthnicity] = useState(null);
    const [selectedGender, setSelectedGender] = useState(null);
    const [selectedLanguages, setSelectedLanguages] = useState(null);
    const [selectedExerciseFrequency, setSelectedExerciseFrequency] = useState(null);
    const [selectedDiet, setSelectedDiet] = useState(null);
    const [selectedSleepPatterns, setSelectedSleepPatterns] = useState(null);
    const [selectedAlcoholConsumption, setSelectedAlcoholConsumption] = useState(null);

    const [randomUser, setRandomUser] = useState({
        heartRate: null,
        breathingRate: null,
        hrv: null,
        skinTemp: null,
        emg: null,
        bvp: null,
        nationality: { value: null },
        ethnicity: { value: null },
        gender: { value: null },
        languages: [{ value: null}, ],
        exerciseFrequency: { value: null},
        diet: { value: null },
        sleepPatterns: { value: null },
        alcoholConsumption: { value: null },

        // other properties...
    });

    // Detect dark mode setting
    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        setIsDarkMode(mediaQuery.matches);
        const handleThemeChange = (e) => setIsDarkMode(e.matches);
        mediaQuery.addEventListener('change', handleThemeChange);
        return () => mediaQuery.removeEventListener('change', handleThemeChange);
    }, []);

    // Fetch users and set a random user
    useEffect(() => {
        const users = getAllUsers();
        if (users && users.length > 0) {
            setRandomUser(users[Math.floor(Math.random() * users.length)]);
        }
    }, []);

    // Update form fields when randomUser changes
    useEffect(() => {
        if (randomUser) {
            // names
            setFirstName(randomUser.firstName);
            setLastName(randomUser.lastName);
            setUserId(randomUser.idNumber);

            // biometric details
            setSelectedNationality(randomUser.nationality);
            setSelectedEthnicity(randomUser.ethnicity);
            setSelectedGender(randomUser.gender);
            setSelectedLanguages(randomUser.languages);
            setSelectedExerciseFrequency(randomUser.exerciseFrequency);
            setSelectedDiet(randomUser.diet);
            setSelectedSleepPatterns(randomUser.sleepPatterns);
            setSelectedAlcoholConsumption(randomUser.alcoholConsumption);

            // ... other field updates ...
            setHeartRate(randomUser.heartRate);
            setBreathingRate(randomUser.breathingRate);
            setBvp(randomUser.bvp);
            setEmg(randomUser.emg);
            setSkinTemp(randomUser.skinTemp);
            setHrv(randomUser.hrv);
        }
    }, [randomUser]);

    // Event handlers for Select components
    const handleGenderChange = (option) => setSelectedGender(option);
    const handleNationalityChange = (option) => setSelectedNationality(option);
    const handleEthnicityChange = (option) => setSelectedEthnicity(option);
    const handleLanguagesChange = (option) => setSelectedLanguages(option);
    const handleExerciseFrequencyChange = (option) => setSelectedExerciseFrequency(option);
    const handleDietChange = (option) => setSelectedDiet(option);
    const handleSleepPatternsChange = (option) => setSelectedSleepPatterns(option);
    const handleAlcoholConsumptionChange = (option) => setSelectedAlcoholConsumption(option);
    const handleUserIdChange = (option) => setUserId(option);
    const [isModified, setIsModified] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = (event) => {
        event.preventDefault();
        navigate('/playlist');
    };

    useEffect(() => {
        const hasChanges =
            parseFloat(heartRate) !== randomUser.heartRate ||
            parseFloat(breathingRate) !== randomUser.breathingRate ||
            parseFloat(hrv) !== randomUser.hrv ||
            parseFloat(skinTemp) !== randomUser.skinTemp ||
            parseFloat(emg) !== randomUser.emg ||
            parseFloat(bvp) !== randomUser.bvp ||
            selectedGender?.value !== randomUser.gender.value ||
            selectedNationality?.value !== randomUser.nationality.value ||
            selectedEthnicity?.value !== randomUser.ethnicity.value ||
            JSON.stringify(selectedLanguages) !== JSON.stringify(randomUser.languages) ||
            selectedExerciseFrequency?.value !== randomUser.exerciseFrequency.value ||
            selectedDiet?.value !== randomUser.diet.value ||
            selectedSleepPatterns?.value !== randomUser.sleepPatterns.value;

        setIsModified(hasChanges);
    }, [
        // heartRate, breathingRate, hrv, skinTemp, emg, bvp,
        selectedGender, selectedNationality, selectedEthnicity, selectedLanguages, selectedExerciseFrequency, selectedDiet, selectedSleepPatterns]);

    // Function to find a matching user based on selected options
    const findMatchingUser = () => {
        const allUsers = getAllUsers();
        return allUsers.find(user =>
            user.gender === selectedGender?.value &&
            user.nationality === selectedNationality?.value &&
            user.ethnicity === selectedEthnicity?.value &&
            user.languages === selectedLanguages?.value &&
            user.exerciseFrequency === selectedExerciseFrequency?.value &&
            user.diet === selectedDiet?.value &&
            user.sleepPatterns === selectedSleepPatterns?.value &&
            user.alcoholConsumption === selectedAlcoholConsumption?.value
        );
    };

    // Update randomUser when any Select component changes
    useEffect(() => {
        const matchedUser = findMatchingUser();
        if (matchedUser) setRandomUser(matchedUser);
    }, [selectedGender, selectedNationality, selectedEthnicity, selectedLanguages, selectedExerciseFrequency, selectedDiet, selectedSleepPatterns, selectedAlcoholConsumption]);

    const { tracks } = useContext(TrackContext);
    // Function to handle logout
    const handleLogout = () => {
        localStorage.removeItem('spotifyAccessToken');
    };

    // Check if tracks array is empty and redirect if necessary
    useEffect(() => {
        if (tracks.length === 0) {
            handleLogout();
            navigate('/spotify-login');
        }
    }, [tracks, navigate]);

    // Main JSX for the form
    return (
        <div
            // className="bg-gradient-to-r from-green-400 to-blue-500 dark:from-gray-700 dark:to-gray-900 min-h-screen flex items-center justify-center"
        >
            <Helmet>
                <title>HarmonizeAI: Submit Your Biometric Data | HarmonizeAI</title>
                <meta name="description" content="Provide your biometric details to enhance your music experience with HarmonizeAI. Get playlists that fit your physical and emotional state." />
                <meta name="keywords" content="biometric data, music personalization, HarmonizeAI, emotional analysis, health data, music experience" />
                <meta property="og:title" content="HarmonizeAI Biometric Form" />
                <meta property="og:description" content="Enter your biometric information to receive music recommendations that suit your mood and physical state with HarmonizeAI." />
                <meta property="og:type" content="website" />
                <meta property="og:url" content={window.location.href} />
                <meta property="og:image" content={darkLogo} /> {/* Update with an appropriate image path */}
            </Helmet>

            <div
                className="max-w-6xl w-full mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-xl p-8 space-y-6">
                <h1 className="text-3xl font-bold text-center text-gray-800 dark:text-gray-100">
                    Biometric Data Submission
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-300 text-center mb-4">
                    Fill in the details to get your personalized experience.
                </p>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* User Info and Selection Fields */}
                    <div className="flex justify-between mb-4">
                        <div className="w-1/2 pr-2">
                            {userId ? (
                                <>
                                    <p className="text-lg font-bold text-gray-700 dark:text-gray-300">{firstName} {lastName}</p>
                                    <p className="text-lg font-bold text-gray-700 dark:text-gray-300">ID: {userId}</p>
                                </>
                            ) : (
                                isModified ? (
                                    <p className="text-lg font-bold text-gray-700 dark:text-gray-300">Enter User
                                        Details:</p>
                                ) : (
                                    <p className="text-lg font-bold text-gray-700 dark:text-gray-300">User: {firstName} {lastName} |
                                        ID: {userId}</p>
                                )
                            )}
                        </div>
                        <div className="w-1/2 pl-2 text-right"> {/* Right align the text inside this div */}
                            <p className="text-lg font-bold text-gray-700 dark:text-gray-300">Emotion: </p>
                        </div>
                    </div>

                    <ResponsiveMasonry columnsCountBreakPoints={{350: 2, 750: 2, 900: 3}}>
                        <Masonry gutter="20px">
                            {/* Gender */}
                            <div className="mb-4">
                                <label htmlFor="gender"
                                       className="mb-1.5 font-bold block text-sm text-gray-700 dark:text-gray-300">
                                    Gender
                                </label>
                                <Select
                                    id="gender"
                                    options={genderOptions}
                                    onChange={handleGenderChange}
                                    value={selectedGender}
                                    styles={getCustomStyles(isDarkMode)}
                                    placeholder="Select your gender"
                                />
                            </div>

                            {/* Nationality */}
                            <div className="mb-4">
                                <label htmlFor="nationality"
                                       className="mb-1.5 font-bold block text-sm text-gray-700 dark:text-gray-300">
                                    Nationality
                                </label>
                                <Select
                                    id="nationality"
                                    options={nationalityOptions}
                                    onChange={handleNationalityChange}
                                    value={selectedNationality}
                                    styles={getCustomStyles(isDarkMode)}
                                    placeholder="Select your nationality"
                                />
                            </div>

                            {/* Ethnicity */}
                            <div className="mb-4">
                                <label htmlFor="ethnicity"
                                       className="mb-1.5 font-bold block text-sm text-gray-700 dark:text-gray-300">
                                    Ethnicity
                                </label>
                                <Select
                                    id="ethnicity"
                                    options={ethnicityOptions}
                                    onChange={handleEthnicityChange}
                                    value={selectedEthnicity}
                                    styles={getCustomStyles(isDarkMode)}
                                    placeholder="Select your ethnicity"
                                />
                            </div>

                            {/* Languages */}
                            <div className="mb-4">
                                <label htmlFor="languages"
                                       className="mb-1.5 font-bold block text-sm text-gray-700 dark:text-gray-300">
                                    First Language
                                </label>
                                <Select
                                    id="languages"
                                    options={languageOptions}
                                    onChange={handleLanguagesChange}
                                    value={selectedLanguages}
                                    styles={getCustomStyles(isDarkMode)}
                                    placeholder="Select a language"
                                />
                            </div>

                            {/* Exercise Frequency */}
                            <div className="mb-4">
                                <label htmlFor="exerciseFrequency"
                                       className="mb-1.5 font-bold block text-sm text-gray-700 dark:text-gray-300">
                                    Exercise Frequency
                                </label>
                                <Select
                                    id="exerciseFrequency"
                                    options={exerciseFrequencyOptions}
                                    onChange={handleExerciseFrequencyChange}
                                    value={selectedExerciseFrequency}
                                    styles={getCustomStyles(isDarkMode)}
                                    placeholder="Select exercise frequency"
                                />
                            </div>

                            {/* Diet */}
                            <div className="mb-4">
                                <label htmlFor="diet"
                                       className="mb-1.5 font-bold block text-sm text-gray-700 dark:text-gray-300">
                                    Diet
                                </label>
                                <Select
                                    id="diet"
                                    options={dietOptions}
                                    onChange={handleDietChange}
                                    value={selectedDiet}
                                    styles={getCustomStyles(isDarkMode)}
                                    placeholder="Select diet"
                                />
                            </div>

                            {/* Sleep Patterns */}
                            <div className="mb-4">
                                <label htmlFor="sleepPatterns"
                                       className="mb-1.5 font-bold block text-sm text-gray-700 dark:text-gray-300">
                                    Sleep Patterns
                                </label>
                                <Select
                                    id="sleepPatterns"
                                    options={sleepPatternsOptions}
                                    onChange={handleSleepPatternsChange}
                                    value={selectedSleepPatterns}
                                    styles={getCustomStyles(isDarkMode)}
                                    placeholder="Select sleep patterns"
                                />
                            </div>

                            {/* Alcohol Consumption */}
                            <div className="mb-4">
                                <label htmlFor="alcoholConsumption"
                                       className="mb-1.5 font-bold block text-sm text-gray-700 dark:text-gray-300">
                                    Alcohol Consumption
                                </label>
                                <Select
                                    id="alcoholConsumption"
                                    options={alcoholConsumptionOptions}
                                    onChange={handleAlcoholConsumptionChange}
                                    value={selectedAlcoholConsumption}
                                    styles={getCustomStyles(isDarkMode)}
                                    placeholder="Select alcohol consumption level"
                                />
                            </div>

                            {/*/!* Mood *!/*/}
                            {/*<div className="mb-4">*/}
                            {/*    <label htmlFor="mood"*/}
                            {/*           className="mb-1.5 font-bold block text-sm text-gray-700 dark:text-gray-300">*/}
                            {/*        Mood*/}
                            {/*    </label>*/}
                            {/*    <Select*/}
                            {/*        id="mood"*/}
                            {/*        options={moodOptions}*/}
                            {/*        onChange={handleMoodChange}*/}
                            {/*        value={selectedMood}*/}
                            {/*        styles={getCustomStyles(isDarkMode)}*/}
                            {/*        placeholder="Select your mood"*/}
                            {/*    />*/}
                            {/*</div>*/}
                        </Masonry>
                    </ResponsiveMasonry>

                    {/* Divider Line */}
                    <div className="w-full">
                        <hr className="border-t-2 border-gray-700 dark:border-gray-300 my-4"/>
                    </div>

                    <div className="w-full px-2 mb-4 text-gray-700 dark:text-gray-300">
                        <p className="text-lg font-semibold mb-1">Enter Sample Data:</p>
                    </div>

                    <ResponsiveMasonry columnsCountBreakPoints={{350: 2, 750: 2, 900: 2}}>
                        <Masonry gutter="20px">
                            {/* Biometric data fields */}
                            <div className="px-2 mb-4">
                                <label className="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-300"
                                       htmlFor="heartRate">
                                    Heart Rate BPM
                                </label>
                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    id="heartRate"
                                    type="number"
                                    defaultValue={randomUser.heartRate}
                                    min="40" max="200" step="0.01"
                                />
                            </div>

                            {/* Breathing Rate */}
                            <div className="px-2 mb-4">
                                <label className="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-300"
                                       htmlFor="breathingRate">
                                    Breathing Rate
                                </label>
                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    id="breathingRate"
                                    type="number"
                                    defaultValue={randomUser.breathingRate}
                                    min="10" max="60" step="0.01"
                                />
                            </div>

                            {/* HRV (Heart Rate Variability) */}
                            <div className="px-2 mb-4">
                                <label className="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-300"
                                       htmlFor="hrv">
                                    HRV (ms)
                                </label>
                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    id="hrv"
                                    type="number"
                                    defaultValue={randomUser.hrv}
                                    min="0" max="1000" step="0.01"
                                />
                            </div>

                            {/* Skin Temperature */}
                            <div className="px-2 mb-4">
                                <label className="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-300"
                                       htmlFor="skinTemp">
                                    Skin Temperature (°C)
                                </label>
                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    id="skinTemp"
                                    type="number"
                                    defaultValue={randomUser.skinTemp}
                                    min="32" max="37" step="0.01"
                                />
                            </div>

                            {/* EMG */}
                            <div className="px-2 mb-4">
                                <label className="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-300"
                                       htmlFor="emg">
                                    EMG (mV)
                                </label>
                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    id="emg"
                                    type="number"
                                    defaultValue={randomUser.skinTemp}
                                    min="32" max="37" step="0.01"
                                />
                            </div>

                            {/* BVP (Blood Volume Pulse) */}
                            <div className="px-2 mb-4">
                                <label className="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-300"
                                       htmlFor="bvp">
                                    BVP (unit)
                                </label>
                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    id="bvp"
                                    type="number"
                                    defaultValue={randomUser.bvp}
                                    min="0" max="100" step="0.01"
                                />
                            </div>
                        </Masonry>
                    </ResponsiveMasonry>

                    {/* Submit Button */}
                    <div className="flex justify-center mt-4">
                        <button
                            onClick={handleSubmit}
                            type="submit"
                            className="w-full animate-pulse hover:animate-none flex justify-center items-center py-3 px-6 border border-transparent shadow-lg text-lg font-semibold rounded-md text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-200 ease-in-out hover:scale-105"
                        >
                            <FaCheckCircle className="mr-2"/>
                            Submit Biometric Data
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default BiometricForm;
