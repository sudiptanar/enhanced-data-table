<template>
  <v-card>
    <v-card-title>
      {{ title }}
      <v-spacer></v-spacer>
      <v-text-field
        v-model="search"
        append-icon="mdi-magnify"
        label="Search"
        single-line
        hide-details
        clearable
        @click:clear="onClear"
        @change="onSearch"
      ></v-text-field>
    </v-card-title>

    <v-data-table
      :headers="columns"
      :items="rows"
      :loading="isLoading"
      hide-default-footer
      @update:options="handleSort"
      :items-per-page="itemsPerPage"
    >
      <template v-slot:footer>
        <div class="footer">
          <v-btn icon :disabled="page === 1" @click="prevPage">
            <v-icon>mdi-chevron-left</v-icon>
          </v-btn>
          <v-btn icon :disabled="!hasNext" @click="nextPage">
            <v-icon>mdi-chevron-right</v-icon>
          </v-btn>
        </div>
      </template>
    </v-data-table>
  </v-card>
</template>

<script>
export default {
  name: "DataTable",
  data() {
    return {
      defaultSortBy: null,
      defaultSortDesc: false,
      search: "",
      page: 1,
    };
  },
  props: {
    title: {
      type: String,
      default: "Table",
    },
    columns: { type: Array, required: true },
    rows: { type: Array, default: () => [] },
    isLoading: { type: Boolean, default: false },
    hasNext: { type: Boolean, default: false },
    itemsPerPage: { type: Number, default: 10 },
  },
  methods: {
    prevPage() {
      if (this.page > 1) {
        this.page--;
        this.$emit("prev-clicked");
      }
    },
    nextPage() {
      if (this.hasNext) {
        this.page++;
        this.$emit("next-clicked");
      }
    },
    onClear() {
      this.$emit("searched-text", "");
    },
    onSearch(searchValue) {
      if(!searchValue) {
        searchValue = "";
      }
      if (searchValue.trim()) {
        this.page = 1;
        this.$emit("searched-text", searchValue.trim());
      }
    },

    handleSort(options) {
      if (options.sortBy.length != 0) {
        let sortOptions = {};
        let isDesc = options.sortDesc[0];
        sortOptions.sortBy = options.sortBy[0];
        sortOptions.sortOrder = isDesc ? "desc" : "asc";
        this.page = 1;
        this.$emit("sort-options", sortOptions);
      }
    },
  },
};
</script>

<style>
.footer {
  display: flex;
  justify-content: end;
}
</style>
