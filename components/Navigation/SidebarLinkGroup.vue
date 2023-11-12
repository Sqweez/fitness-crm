<template>
  <li class="px-3 py-2 rounded-sm mb-0.5 last:mb-0" :class="activeCondition && 'bg-gray-900'">
    <slot :handleClick="handleClick" :expanded="expanded" />
  </li>
</template>

<script>
export default {
  name: 'SidebarLinkGroup',
  props: ['activeCondition'],
  data: () => ({
    expanded: false,
  }),
  created () {
    this.expanded = this.activeCondition;
  },
  methods: {
    handleClick () {
      this.expanded = !this.expanded;
    }
  }
}
</script>
