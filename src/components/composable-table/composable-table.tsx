import { Component, h, State, Prop } from "@stencil/core";

@Component({
  tag: "composable-table",
  styleUrl: "./composable-table.css",
  shadow: true,
})
export class ComposableTable {
  @Prop() data: string;
  @Prop() itemsperpage: number;

  @State() currentSortColumn: number = 0;
  @State() isAscending: boolean = true;
  @State() currentPage: number = 1;
  @State() filteredRows: any[] = [];
  
  @State() parsedData: { headers: string[], rows: any[] } = { headers: [], rows: [] };
  @State() parsedItemsPerPage: number;


  async componentWillRender() {
    if (this.data && JSON.stringify(this.parsedData) !== this.data) {
      this.parsedData = JSON.parse(this.data);
    }
    this.parsedItemsPerPage = Number(this.itemsperpage) || 10;
  }

  get displayedRows(): any[] {
    const rowsSource =
      this.filteredRows.length > 0 ? this.filteredRows : this.parsedData.rows;
    const startIndex = (this.currentPage - 1) * this.parsedItemsPerPage;
    const endIndex = startIndex + this.parsedItemsPerPage;

    return rowsSource
      .sort((rowA, rowB) => {
        const cellA =
          rowA[this.parsedData.headers[this.currentSortColumn].toLowerCase()];
        const cellB =
          rowB[this.parsedData.headers[this.currentSortColumn].toLowerCase()];

        if (cellA < cellB) return this.isAscending ? -1 : 1;
        if (cellA > cellB) return this.isAscending ? 1 : -1;
        return 0;
      })
      .slice(startIndex, endIndex);
  }


  filterTable(event: Event) {
    const searchTerm = (event.target as HTMLInputElement).value
      ?.trim()
      .toLowerCase();
    this.filteredRows = this.parsedData.rows.filter((row) => {
      return Object.values(row).some((value) =>
        value.toString().toLowerCase().includes(searchTerm)
      );
    });
    this.currentPage = 1;
  }

  changePage(newPage: number) {
    const totalPages = Math.ceil(this.parsedData.rows.length / this.parsedItemsPerPage);

    if (newPage < 1 || newPage > totalPages) {
      return;
    }

    this.currentPage = newPage;
  }

  sortTable(columnIndex: number) {
    this.isAscending = !this.isAscending;

    const rowsSource =
      this.filteredRows.length > 0 ? this.filteredRows : this.parsedData.rows;
    rowsSource.sort((rowA, rowB) => {
      const cellA = rowA[this.parsedData.headers[columnIndex].toLowerCase()];
      const cellB = rowB[this.parsedData.headers[columnIndex].toLowerCase()];

      if (cellA < cellB) return this.isAscending ? -1 : 1;
      if (cellA > cellB) return this.isAscending ? 1 : -1;
      return 0;
    });

    this.currentSortColumn = columnIndex;
  }

  render() {
    return (
      <div id="table-container">
        <h2 id="table-title"></h2>
        <div id="search-container">
          <input
            type="text"
            id="searchInput"
            placeholder="Search..."
            onInput={(event: Event) => this.filterTable(event)}
          />
        </div>
        <div id="tableWrapper">
          <table id="myTable">
            <thead>
              <tr>
                {this.parsedData.headers.map((header, index) => (
                  <th onClick={() => this.sortTable(index)}>{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {this.displayedRows.map((row) => (
                <tr>
                  {this.parsedData.headers.map((header) => (
                    <td>{row[header.toLowerCase()]}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          <div class="pagination-buttons">
            <button
              class="pagination-button prev-button"
              onClick={() => this.changePage(this.currentPage - 1)}
              disabled={this.currentPage === 1}
            >
              Prev
            </button>
            <span class="pagination-info">
              {this.currentPage} /{" "}
              {Math.ceil(this.parsedData.rows.length / this.parsedItemsPerPage)}
            </span>
            <button
              class="pagination-button next-button"
              onClick={() => this.changePage(this.currentPage + 1)}
              disabled={
                this.currentPage ===
                Math.ceil(this.parsedData.rows.length / this.parsedItemsPerPage)
              }
            >
              Next
            </button>
          </div>
        </div>
      </div>
    );
  }
}
