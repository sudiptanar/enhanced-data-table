<template>
  <v-app>
    <NavBar />
    <v-main>
      <Tabs/>
      <v-card>
        <DataTable
          :columns="columns"
          :rows="users"
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
      title: "User Deatils",
      columns: [
        { text: "Name", align: "start", value: "fullName" },
        { text: "Email", value: "email" },
        { text: "Created On", value: "createdOn" },
        { text: "Last Login", value: "lastLogin" },
        { text: "Roles", value: "roles", sortable: false },
        { text: "Status", value: "status", sortable: false },
      ],
      loading: false,
      users: [],
      offset: 0,
      limit: 0,
      filter: "",
      sortOrder: "asc",
      sort: "fullName",
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
      this.users = [];
      let url = `${this.getServerUrlFromLocalStorage()}/v2.1/users?`;
      let params = [];
      params.push("offset=" + this.offset);
      params.push("limit=" + this.limit);
      params.push("filter=" + this.filter);
      params.push("sortOrder=" + this.sortOrder);
      params.push("sort=" + this.sort);
      params.push("minify=" + this.minify);

      url += params.join("&");
      try {
        this.loading = true;
        const response = await fetch(url, {
          headers: {
            Authorization: `Bearer ${this.getTokenFromLocalStorage()}`,
          },
        });
        const usersData = await response.json();
        if (usersData.users) {
          usersData.users.forEach((element) => {
            element.createdOn = this.longToReadableDate(element.createdOn);
            element.lastLogin = this.longToReadableDate(element.lastLogin);
            var roles = [];
            if (element.roles) {
              element.roles.forEach((role) => {
                roles.push(role.label);
              });
            }
            element.roles = roles.join(", ");
            this.users.push(element);
          });

          const meta = usersData._meta;
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
        this.filter = "fullName co '" + newV + "' or email co '" + newV + "'";
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
