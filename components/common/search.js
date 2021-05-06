import PropTypes from 'prop-types';
import React from 'react';
import debounce from 'lodash/debounce';
import { CSSTransition } from 'react-transition-group';
import $ from 'jquery';
import LoadingIcon from '../../components/common/loadingIcon';

export default class SearchBar extends React.Component {
  static contextTypes = {
    i18n: PropTypes.object,
    router: PropTypes.object
  };

  static propTypes = {
    searchText: PropTypes.string,
    placeholder: PropTypes.string,
    searchResults: PropTypes.array,
    loading: PropTypes.bool,
    sendSearchQuery: PropTypes.func.isRequired,
    prepareResultItem: PropTypes.func.isRequired,
    cleanSearch: PropTypes.func.isRequired,
    className: PropTypes.string.isRequired
  };

  constructor (props) {
    super(props);
    this._searchRef = React.createRef();
    this.state = {
      index: 0
    };
    this._search = debounce((searchText) => {
      this.props.sendSearchQuery(searchText);
    }, 300);
  }

  handleSubmit = () => () => {
    const searchText = this._searchRef.current.value;
    if (searchText && searchText.length > 2) {
      this._search(searchText.trim());
    } else {
      this.props.cleanSearch();
    }
  }

  escapeRegex (regex) {
    return regex.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  highlight (text, key) {
    const searchText = this._searchRef.current.value.trim().toLowerCase();
    let textHighlight = false;
    searchText.split(' ').forEach((textPart) => {
      textPart = textPart.trim();
      if (text && !textHighlight && text.toLowerCase().indexOf(textPart) === 0) {
        const reg = new RegExp(this.escapeRegex(textPart), 'i');
        const searchTextResult = text.match(reg);
        textHighlight = (
          <span key={key + text}>
            <em className='highlight'>{searchTextResult[0]}</em>
            {text.toLowerCase().replace(textPart, '')}
          </span>
        );
      }
    });
    return textHighlight || text;
  }

  remove = (e) => {
    if (e) e.preventDefault();
    this._searchRef.current.value = '';
    this.props.cleanSearch();
  }

  componentDidMount () {
    $(window.document.body).on('click.search', (e) => {
      if (this.props.searchResults.length && !$(e.target).closest('div.search-block').length) {
        this.remove();
      }
    });
  }

  componentWillUnmount () {
    $(window.document.body).off('click.search');
  }

  render () {
    const { l } = this.context.i18n;
    const {
      searchResults,
      searchText,
      loading,
      prepareResultItem,
      placeholder,
      className
    } = this.props;

    let resultsHolder = null;
    let removeLink = null;
    if (!loading && searchText) {
      if (searchResults.length) {
        const resultsItems = searchResults.map((resultItem) => {
          return prepareResultItem(resultItem);
        });
        resultsHolder = (
          <div className='search-drop'>
            {resultsItems}
          </div>
        );
      } else {
        resultsHolder = (
          <div className='search-drop'>
            <p>{l('No results found')}</p>
          </div>
        );
      }
      removeLink = (<a href='/' className='remove' onClick={this.remove}>Remove</a>);
    }

    return (
      <div className={className ? `search-block ${className}` : 'search-block'}>
        <LoadingIcon loading={loading} />
        <input
          type='text'
          name='searchBar'
          ref={this._searchRef}
          placeholder={placeholder}
          defaultValue={searchText}
          onChange={this.handleSubmit()} />
        {removeLink}
        <CSSTransition
          timeout={300}>
            {state => (
              resultsHolder
            )}
        </CSSTransition>
      </div>
    );
  }
}
