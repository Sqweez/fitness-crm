<template>
<div class="relative inline-flex" v-click-outside="() => {dropdownOpen = false}">
  <button
    title="Клиенты"
    ref="trigger"
    class="w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-gray-200 transition duration-150 rounded-full"
    :class="{ 'bg-gray-200': dropdownOpen }"
    aria-haspopup="true"
    @click.prevent="dropdownOpen = !dropdownOpen"
    :aria-expanded="dropdownOpen"
  >
    <v-icon>
      mdi-account-multiple
    </v-icon>
  </button>
  <transition
    enter-active-class="transition ease-out duration-200 transform"
    enter-from-class="opacity-0 -translate-y-2"
    enter-to-class="opacity-100 translate-y-0"
    leave-active-class="transition ease-out duration-200"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div v-show="dropdownOpen" class="origin-top-right z-10 absolute top-full min-w-44 bg-white border border-gray-200 py-1.5 rounded shadow-lg overflow-hidden mt-1"  :class="align === 'right' ? 'right-0' : 'left-0'">
      <div class="text-xs font-semibold text-gray-400 uppercase pt-1.5 pb-2 px-3">Клиенты</div>
      <ul
        ref="dropdown"
        @focusin="dropdownOpen = true"
        @focusout="dropdownOpen = false"
      >
        <li>
          <router-link class="font-medium text-sm text-indigo-500 hover:text-indigo-600 flex items-center py-1 px-3" to="/clients/groups/birthdays" @click="dropdownOpen = false">
            <span>Именинники</span>
          </router-link>
        </li>
        <li>
          <router-link class="font-medium text-sm text-indigo-500 hover:text-indigo-600 flex items-center py-1 px-3" to="/clients/groups/online" @click="dropdownOpen = false">
            <span>Кто в клубе</span>
          </router-link>
        </li>
        <li>
          <router-link class="font-medium text-sm text-indigo-500 hover:text-indigo-600 flex items-center py-1 px-3" to="/clients/groups/guests" @click="dropdownOpen = false">
            <span>Гости клуба за сегодня</span>
          </router-link>
        </li>
        <li>
          <router-link class="font-medium text-sm text-indigo-500 hover:text-indigo-600 flex items-center py-1 px-3" to="/clients/groups/sleeps" @click="dropdownOpen = false">
            <span>Спящие клиенты</span>
          </router-link>
        </li>
        <li>
          <router-link class="font-medium text-sm text-indigo-500 hover:text-indigo-600 flex items-center py-1 px-3" to="/statistics/unlimited-ending" @click="dropdownOpen = false">
            <span>Заканчивающиеся безлимиты</span>
          </router-link>
        </li>
      </ul>
    </div>
  </transition>
</div>

</template>

<script>
import userMixin from '@/mixins/userMixin';

export default {
  mixins: [userMixin],
  data: () => ({
    dropdownOpen: false
  }),
  computed: {},
  methods: {}
}
</script>

<style scoped lang="scss">

</style>
