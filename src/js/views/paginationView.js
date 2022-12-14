import View from './View.js';
import icons from 'url:../../img/icons.svg';

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  addHandlerClick(handler) {
    this._parentElement.addEventListener(`click`, function (e) {
      const btn = e.target.closest('.btn--inline');
      if (!btn) return;
      //   console.log(btn);
      const goToPage = +btn.dataset.goto;
      //   console.log(goToPage);
      handler(goToPage);
    });
  }

  _generateMarkup() {
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );
    const curPage = this._data.page;
    // console.log(numPages);
    // Page 1 , and there are other pages
    if (curPage === 1 && numPages > 1) {
      //   console.log(`Page 1 , and there are other pages`);
      return this._generateMarkupButton(`next`, curPage);
    }
    // Page X, and there are other pages
    if (curPage !== 1 && curPage < numPages && numPages > 1) {
      //   console.log(`Page X, and there are other pages`);
      return this._generateMarkupButton(`middle`, curPage);
    }
    // Last page
    if (curPage === numPages && numPages > 1) {
      //   console.log(`Last page`);
      return this._generateMarkupButton(`prev`, curPage);
    }
    // Page 1, and there are No other pages
    if (curPage === 1 && numPages === 1) {
      //   console.log(`Page 1, and there are No other pages`);
      return '';
    }
  }

  _generateMarkupButton(direction, page) {
    if (direction === `prev`) {
      return `
        <button data-goto="${
          page - 1
        }" class="btn--inline pagination__btn--prev">
        <svg class="search__icon">
          <use href="${icons}#icon-arrow-left"></use>
        </svg>
        <span>Page ${page - 1}</span>
      </button>
        `;
    }

    if (direction === `middle`) {
      return `
      <button data-goto="${page - 1}"class="btn--inline pagination__btn--prev">
        <svg class="search__icon">
          <use href="${icons}#icon-arrow-left"></use>
        </svg>
        <span>Page ${page - 1}</span>
      </button>
        <button data-goto="${
          page + 1
        }"class="btn--inline pagination__btn--next">
            <span>Page ${page + 1}</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
          </button>
        `;
    }
    if (direction === `next`) {
      return `
       
      <button data-goto="${page + 1}"class="btn--inline pagination__btn--next">
            <span>Page ${page + 1}</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
        </button>
        `;
    }
  }
}
export default new PaginationView();
