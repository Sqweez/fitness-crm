<template>
  <div class="relative inline-flex" v-click-outside="() => {dropdownOpen = false}">
    <button
      ref="trigger"
      class="inline-flex justify-center items-center group"
      aria-haspopup="true"
      @click.prevent="dropdownOpen = !dropdownOpen"
      :aria-expanded="dropdownOpen"
    >
      <div class="flex items-center truncate">
        <span class="truncate ml-2 text-sm font-medium group-hover:text-gray-800">
          {{ $auth.user.name }}
        </span>
        <svg class="w-3 h-3 shrink-0 ml-1 fill-current text-gray-400" viewBox="0 0 12 12">
          <path d="M5.9 11.4L.5 6l1.4-1.4 4 4 4-4L11.3 6z" />
        </svg>
      </div>
    </button>
    <transition
      enter-active-class="transition ease-out duration-200 transform"
      enter-from-class="opacity-0 -translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition ease-out duration-200"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div v-show="dropdownOpen" class="origin-top-right z-10 absolute top-full min-w-44 bg-white border border-gray-200 py-1.5 rounded shadow-lg overflow-hidden mt-1" :class="align === 'right' ? 'right-0' : 'left-0'">
        <div class="pt-0.5 pb-2 px-3 mb-1 border-b border-gray-200">
          <div class="text-sm font-medium">{{ $auth.user.club.name }}</div>
          <div class="text-xs text-black italic">{{ $auth.user.position }}</div>
        </div>
        <ul
          ref="dropdown"
          @focusin="dropdownOpen = true"
          @focusout="dropdownOpen = false"
        >
          <li v-if="false">
            <router-link class="font-medium text-sm text-indigo-500 hover:text-indigo-600 flex items-center py-1 px-3" to="/" @click="dropdownOpen = false">Settings</router-link>
          </li>
          <li v-if="$user.can_change_club">
            <a
              class="font-medium text-sm text-indigo-500 hover:text-indigo-600 flex items-center py-1 px-3"
              href="#"
              @click.prevent="$root.$emit('change:club')"
            >
              Сменить клуб
            </a>
          </li>
          <li>
            <a
              class="font-medium text-sm text-indigo-500 hover:text-indigo-600 flex items-center py-1 px-3"
              href="#"
              @click.prevent="$auth.logout()"
            >
              Выход
            </a>
          </li>
        </ul>
      </div>
    </transition>
  </div>
</template>

<script>
import { User } from 'lucide-vue';
import {mapGetters} from 'vuex';

export default {
  name: 'DropdownProfile',
  components: { User },
  props: ['align'],
  data: () => ({
    dropdownOpen: false,
  }),
  mounted() {
    // document.addEventListener('click', this.clickHandler)
    // document.addEventListener('keydown', this.keyHandler)
  },
  beforeDestroy() {
    // document.removeEventListener('click', this.clickHandler)
    // document.removeEventListener('keydown', this.keyHandler)
  },
  computed: {
    ...mapGetters({
      $user: 'user/$user'
    }),
  },
  methods: {
    clickHandler({target}) {
      if (!this.dropdownOpen || this.$refs.dropdown.contains(target)) return
      this.dropdownOpen = false;
    },
    keyHandler({keyCode}) {
      if (!this.dropdownOpen  || keyCode !== 27) return
      this.dropdownOpen = false;
    }
  },
}
</script>
