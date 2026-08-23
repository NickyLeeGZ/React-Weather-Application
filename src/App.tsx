import './App.css'
import { Header } from './components/Header'
import { SearchHistory } from './components/SearchHistory'
import { WeatherSearch } from './components/WeatherSearch'

const App = () => {
  return <>
    <Header value={`Today's Weather`} />
    <WeatherSearch />
    <Header value={`Search History`} />
    <SearchHistory />
  </>
}

export default App
