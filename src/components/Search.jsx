import PropTypes from 'prop-types';

const Search = ({ searchTerm, setSearchTerm }) => {
    return (
        <div className="search">
            <div>
                <img src="./search.svg" alt="" />
                <input type="text" placeholder="Search through thousands of movies" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
        </div>
    )
}

Search.propTypes = {
    searchTerm: PropTypes.string,
    setSearchTerm: PropTypes.func
}

export default Search