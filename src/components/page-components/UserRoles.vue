<template>
    <v-app>
      <NavBar />
      <v-main>
        <Tabs/>
        <v-card>
          <DataTable
            :columns="columns"
            :rows="roles"
            :title="title"
            :isLoading="loading"
            :hasNext="hasNext"
            :itemsPerPage="itemsPerPage"
            @searched-text="performSearch"
            @prev-clicked="prevClicked"
            @next-clicked="nextClicked"
            @sort-options="handleSort"
          ></DataTable>
        </v-card>
      </v-main>
    </v-app>
  </template>
  
  <script>
  import DataTable from "../reusable-components/DataTable.vue";
  import { globalMethods } from "../../utility.js";
  import NavBar from "../reusable-components/NavBar.vue";
  import Tabs from "../reusable-components/TabsView.vue";
  export default {
    name: "UserDetails",
    mixins: [globalMethods],
    data() {
      return {
        title: "User Roles",
        columns: [
          { text: "Role", align: "start", value: "label" },
          { text: "Role Description", value: "description",sortable: false },
          { text: "Type", value: "type" },
        ],
        loading: false,
        roles: [],
        offset: 0,
        limit: 0,
        filter: "",
        sortOrder: "asc",
        sort: "label",
        minify: false,
        hasNext: false,
        itemsPerPage: 15,
      };
    },
    components: {
      DataTable,
      NavBar,
      Tabs
    },
    methods: {
      async fetchData() {
        this.roles = [];
        let url = `${this.getServerUrlFromLocalStorage()}/v2.1/roles?`;
        let params = [];
        params.push("offset=" + this.offset);
        params.push("limit=" + this.limit);
        params.push("filter=" + this.filter);
        params.push("sortOrder=" + this.sortOrder);
        params.push("sort=" + this.sort);
  
        url += params.join("&");
        try {
          this.loading = true;
          const response = await fetch(url, {
            headers: {
              Authorization: `Bearer ${this.getTokenFromLocalStorage()}`,
            },
          });
          const rolesData = await response.json();
          if (rolesData.roles) {
            rolesData.roles.forEach((element) => {
              this.roles.push(element);
            });
  
            const meta = rolesData._meta;
            if (meta.total > meta.limit + meta.offset) {
              this.hasNext = true;
            } else {
              this.hasNext = false;
            }
          }
        } catch (error) {
          console.error(error);
        } finally {
          this.loading = false;
        }
      },
      longToReadableDate(longDate) {
        return longDate ? new Date(longDate).toDateString() : "-";
      },
      performSearch(newV) {
        this.offset = 0;
        if (!newV) {
          this.filter = "";
        } else {
          this.filter = "label co '" + newV + "' or description co '" + newV + "' or type co '"+ newV +"'";
        }
        this.fetchData();
      },
      prevClicked() {
        this.offset = Math.max(0, this.offset - this.itemsPerPage);
        this.fetchData();
      },
      nextClicked() {
        this.offset = this.offset + this.itemsPerPage;
        this.fetchData();
      },
      handleSort(sortOptions) {
        this.offset = 0;
        this.sort = sortOptions.sortBy;
        this.sortOrder = sortOptions.sortOrder;
        this.fetchData();
      },
    },
    mounted() {
      this.limit = this.itemsPerPage;
      this.fetchData();
    },
  };
  </script>
  
  <style></style>
  