import { useState, useEffect } from 'react';
import type { SearchHistoryEntry } from '../types/SearchHistory';

export const SearchHistory = () => {
    const [searchHistory, setSearchHistory] = useState<SearchHistoryEntry[]>([]);

    const loadSearchHistory = () => {
        const savedSearchHistory = sessionStorage.getItem('weatherHistory');
        if (savedSearchHistory) setSearchHistory(JSON.parse(savedSearchHistory));
    };

    const clearSearchHistory = () => {
        sessionStorage.removeItem('weatherHistory');
        setSearchHistory([]);
    }

    const onSearch = (city: string, country: string) => {
        window.dispatchEvent(
            new CustomEvent('searchFromHistory', {
                detail: { city, country },
            })
        );
    };

    const onDelete = (indexToDelete: number) => {
        const updatedHistory = searchHistory.filter((_, index) => index !== indexToDelete);

        setSearchHistory(updatedHistory);
        sessionStorage.setItem('weatherHistory', JSON.stringify(updatedHistory));

        window.dispatchEvent(new Event('sessionStorageUpdated'));
    };

    useEffect(() => {
        loadSearchHistory();

        const handleUpdate = () => loadSearchHistory();
        const clearHistory = () => clearSearchHistory();

        window.addEventListener('sessionStorageUpdated', handleUpdate);
        window.addEventListener('sessionStorageCleared', clearHistory);

        return () => {
            window.removeEventListener('sessionStorageUpdated', handleUpdate);
            window.removeEventListener('sessionStorageCleared', clearHistory);
        };
    }, []);

    return (
        searchHistory.length === 0 ? <>
            No Records
        </> : <ol style={{ paddingLeft: '35px', margin: 0, marginTop: -20 }}>
            {searchHistory.map((item, index) => (
                <li key={index} style={{ marginBottom: '8px' }}>
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            width: '100%',
                        }}
                    >
                        <span>
                            <span className="capitalize-first">{item.city}</span>, {item.country.toUpperCase()}
                        </span>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span>{item.time}</span>
                            <button type="button" onClick={() => onSearch(item.city, item.country)}>
                                Search
                            </button>
                            <button type="button" onClick={() => onDelete(index)}>
                                Delete
                            </button>
                        </div>
                    </div>
                </li>
            ))}
        </ol>
    );
};