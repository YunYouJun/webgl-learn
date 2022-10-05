<script lang="ts" setup>
import { useRouter } from "vue-router";

const router = useRouter()
const routes = computed(() => router.getRoutes())
console.log(routes)

</script>

<template>
  <main class="px-4 py-10 text-center text-gray-700 dark:text-gray-200">
    <NavMenu />
    <RouterView />

    <div class="max-w-3xl" p="2" m="auto" text="lg">
      <ul text="left" class="list-circle">
        <template v-for="item in routes">
          <li v-if="item.name" :key="item.path">
            <router-link class="text-blue-600" :to="item.path">
              {{ item.name }}
            </router-link>
          </li>
        </template>
      </ul>
    </div>
  </main>
</template>
