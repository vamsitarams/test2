import PropTypes from 'prop-types';
import React from 'react';
import Paginator from 'react-pagify';
import segmentize from 'segmentize';

export class Pager extends React.Component {
  static contextTypes = {
    i18n: PropTypes.object
  };

  static propTypes = {
    page: PropTypes.number.isRequired,
    pages: PropTypes.number.isRequired,
    switchPage: PropTypes.func.isRequired
  };

  get pager () {
    const { page, pages } = this.props;
    const pagerSettings = segmentize({
      page: page,
      pages: pages,
      beginPages: 1,
      endPages: 1,
      sidePages: 5
    });
    let pager = <div />;

    const prevPage = page - 1;
    let prev;
    if (prevPage > 0) {
      prev = <Paginator.Button page={prevPage}><em className='prev'>Previous</em></Paginator.Button>;
    }

    const nextPage = page + 1;
    let next;
    if (nextPage <= pages) {
      next = <Paginator.Button page={nextPage}><em className='next'>Next</em></Paginator.Button>;
    }
    if (this.props.pages > 1) {
      pager = (
        <div>
          <Paginator.Context
            className='pagify-pagination'
            segments={pagerSettings}
            onSelect={this.props.switchPage}
            ellipsis={'…'}>
            {prev}
            <Paginator.Segment field='beginPages' />
            <Paginator.Ellipsis
              className='ellipsis'
              previousField='beginPages'
              nextField='previousPages' />
            <Paginator.Segment field='previousPages' />
            <Paginator.Segment field='centerPage' className='selected' />
            <Paginator.Segment field='nextPages' />
            <Paginator.Ellipsis
              className='ellipsis'
              previousField='nextPages'
              nextField='endPages' />
            <Paginator.Segment field='endPages' />
            {next}
          </Paginator.Context>
        </div>
      );
    }
    return pager;
  }

  render = () => this.pager;
}
export default Pager;
