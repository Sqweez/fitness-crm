<template>
  <div class="sidebar-v2">
    <!-- Sidebar backdrop (mobile only) -->
    <div
      class="sidebar-backdrop"
      :class="{ 'sidebar-backdrop--visible': sidebarOpen }"
      @click="$emit('close-sidebar')"
    ></div>

    <!-- Sidebar -->
    <aside
      class="sidebar-container"
      :class="{ 'sidebar-container--open': sidebarOpen }"
    >
      <!-- Top Content -->
      <div class="sidebar-top">
        <!-- Logo section -->
        <div class="sidebar-logo">
          <router-link to="/" class="sidebar-logo__link">
            <span class="sidebar-logo__text">Fit CRM</span>
          </router-link>
          <button class="sidebar-slider" @click="toggleSidebar">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6.25 7.5L3.75 10L6.25 12.5" stroke="#AFAFAF" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M13.75 7.5L16.25 10L13.75 12.5" stroke="#AFAFAF" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>

        <!-- Main Container -->
        <div class="sidebar-main">
          <!-- Primary Menu -->
          <nav class="sidebar-menu">
            <!-- Dashboard -->
            <router-link to="/" custom v-slot="{ navigate, isExactActive }">
              <button
                class="sidebar-menu-item"
                :class="{ 'sidebar-menu-item--active': isExactActive }"
                @click="navigate"
              >
                <span class="sidebar-menu-item__content">
                  <svg class="sidebar-menu-item__icon" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="10" cy="10" r="7.5" stroke="currentColor" stroke-width="1.5"/>
                    <path d="M10 2.5V10" stroke="currentColor" stroke-width="1.5"/>
                    <path d="M10 10L15.3033 15.3033" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                  </svg>
                  <span class="sidebar-menu-item__label">Dashboard</span>
                </span>
              </button>
            </router-link>

            <!-- Notifications -->
            <router-link to="/notifications" custom v-slot="{ navigate, isActive }">
              <button
                class="sidebar-menu-item"
                :class="{ 'sidebar-menu-item--active': isActive }"
                @click="navigate"
              >
                <span class="sidebar-menu-item__content">
                  <svg class="sidebar-menu-item__icon" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5.625 6.875C5.625 4.45875 7.58375 2.5 10 2.5C12.4162 2.5 14.375 4.45875 14.375 6.875V10L16.25 12.5V15H3.75V12.5L5.625 10V6.875Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M7.5 15V15.625C7.5 16.9557 8.61929 18.125 10 18.125C11.3807 18.125 12.5 16.9557 12.5 15.625V15" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                  <span class="sidebar-menu-item__label">Notifications</span>
                </span>
              </button>
            </router-link>

            <!-- Notes -->
            <router-link to="/notes" custom v-slot="{ navigate, isActive }">
              <button
                class="sidebar-menu-item"
                :class="{ 'sidebar-menu-item--active': isActive }"
                @click="navigate"
              >
                <span class="sidebar-menu-item__content">
                  <svg class="sidebar-menu-item__icon" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12.5 3.125H4.375C4.02982 3.125 3.75 3.40482 3.75 3.75V16.25C3.75 16.5952 4.02982 16.875 4.375 16.875H15.625C15.9702 16.875 16.25 16.5952 16.25 16.25V6.875L12.5 3.125Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M12.5 3.125V6.875H16.25" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                  <span class="sidebar-menu-item__label">Notes</span>
                </span>
              </button>
            </router-link>

            <!-- Tasks -->
            <router-link to="/tasks" custom v-slot="{ navigate, isActive }">
              <button
                class="sidebar-menu-item"
                :class="{ 'sidebar-menu-item--active': isActive || isTasksActive }"
                @click="navigate"
              >
                <span class="sidebar-menu-item__content">
                  <svg class="sidebar-menu-item__icon" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M13.125 3.125H15C15.3452 3.125 15.625 3.40482 15.625 3.75V16.25C15.625 16.5952 15.3452 16.875 15 16.875H5C4.65482 16.875 4.375 16.5952 4.375 16.25V3.75C4.375 3.40482 4.65482 3.125 5 3.125H6.875" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M6.875 2.5C6.875 2.15482 7.15482 1.875 7.5 1.875H12.5C12.8452 1.875 13.125 2.15482 13.125 2.5V3.75C13.125 4.09518 12.8452 4.375 12.5 4.375H7.5C7.15482 4.375 6.875 4.09518 6.875 3.75V2.5Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M7.5 9.375H12.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M7.5 11.875H12.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                  <span class="sidebar-menu-item__label">Tasks</span>
                </span>
              </button>
            </router-link>

            <!-- Emails -->
            <router-link to="/emails" custom v-slot="{ navigate, isActive }">
              <button
                class="sidebar-menu-item"
                :class="{ 'sidebar-menu-item--active': isActive }"
                @click="navigate"
              >
                <span class="sidebar-menu-item__content">
                  <svg class="sidebar-menu-item__icon" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2.5 4.375H17.5V15C17.5 15.3452 17.2202 15.625 16.875 15.625H3.125C2.77982 15.625 2.5 15.3452 2.5 15V4.375Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M17.5 4.375L10 11.25L2.5 4.375" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                  <span class="sidebar-menu-item__label">Emails</span>
                </span>
                <svg class="sidebar-menu-item__caret" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4 6L8 10L12 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </button>
            </router-link>

            <!-- Calendars -->
            <router-link to="/calendars" custom v-slot="{ navigate, isActive }">
              <button
                class="sidebar-menu-item"
                :class="{ 'sidebar-menu-item--active': isActive }"
                @click="navigate"
              >
                <span class="sidebar-menu-item__content">
                  <svg class="sidebar-menu-item__icon" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M16.25 3.125H3.75C3.40482 3.125 3.125 3.40482 3.125 3.75V16.25C3.125 16.5952 3.40482 16.875 3.75 16.875H16.25C16.5952 16.875 16.875 16.5952 16.875 16.25V3.75C16.875 3.40482 16.5952 3.125 16.25 3.125Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M13.75 1.875V4.375" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M6.25 1.875V4.375" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M3.125 6.875H16.875" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    <circle cx="7.1875" cy="10" r="0.9375" fill="currentColor"/>
                    <circle cx="11.25" cy="10" r="0.9375" fill="currentColor"/>
                  </svg>
                  <span class="sidebar-menu-item__label">Calendars</span>
                </span>
              </button>
            </router-link>
          </nav>

          <!-- Separator -->
          <div class="sidebar-separator"></div>

          <!-- Database Section -->
          <div class="sidebar-section">
            <div class="sidebar-section__header">DATABASE</div>
            <nav class="sidebar-menu sidebar-menu--database">
              <!-- Analytics -->
              <router-link to="/statistics/common" custom v-slot="{ navigate, isActive }">
                <button
                  class="sidebar-menu-item"
                  :class="{ 'sidebar-menu-item--active': isActive || isStatisticsActive }"
                  @click="navigate"
                >
                  <span class="sidebar-menu-item__content">
                    <svg class="sidebar-menu-item__icon" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M2.5 16.25H17.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                      <path d="M2.5 12.5L7.5 7.5L11.25 11.25L17.5 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                      <path d="M13.75 5H17.5V8.75" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    <span class="sidebar-menu-item__label">Analytics</span>
                  </span>
                </button>
              </router-link>

              <!-- Contacts -->
              <router-link to="/clients" custom v-slot="{ navigate, isActive }">
                <button
                  class="sidebar-menu-item"
                  :class="{ 'sidebar-menu-item--active': isActive || isClientsActive }"
                  @click="navigate"
                >
                  <span class="sidebar-menu-item__content">
                    <svg class="sidebar-menu-item__icon" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M15 2.5H5.625C5.27982 2.5 5 2.77982 5 3.125V16.875C5 17.2202 5.27982 17.5 5.625 17.5H15C15.3452 17.5 15.625 17.2202 15.625 16.875V3.125C15.625 2.77982 15.3452 2.5 15 2.5Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                      <path d="M2.5 5.3125H5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                      <path d="M2.5 8.4375H5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                      <path d="M2.5 11.5625H5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                      <path d="M2.5 14.6875H5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                      <circle cx="10.3125" cy="7.5" r="1.5625" stroke="currentColor" stroke-width="1.5"/>
                      <path d="M7.5 13.125C7.5 11.5692 8.75736 10.3125 10.3125 10.3125C11.8676 10.3125 13.125 11.5692 13.125 13.125" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    <span class="sidebar-menu-item__label">Contacts</span>
                  </span>
                </button>
              </router-link>

              <!-- Companies -->
              <router-link to="/companies" custom v-slot="{ navigate, isActive }">
                <button
                  class="sidebar-menu-item"
                  :class="{ 'sidebar-menu-item--active': isActive }"
                  @click="navigate"
                >
                  <span class="sidebar-menu-item__content">
                    <svg class="sidebar-menu-item__icon" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M16.875 5.625H3.125C2.77982 5.625 2.5 5.90482 2.5 6.25V15.625C2.5 15.9702 2.77982 16.25 3.125 16.25H16.875C17.2202 16.25 17.5 15.9702 17.5 15.625V6.25C17.5 5.90482 17.2202 5.625 16.875 5.625Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                      <path d="M13.125 5.625V4.375C13.125 4.04348 12.9933 3.72554 12.7589 3.49112C12.5245 3.2567 12.2065 3.125 11.875 3.125H8.125C7.79348 3.125 7.47554 3.2567 7.24112 3.49112C7.0067 3.72554 6.875 4.04348 6.875 4.375V5.625" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                      <path d="M17.5 9.6875C15.1823 10.9087 12.6102 11.5438 10 11.5438C7.38984 11.5438 4.81773 10.9087 2.5 9.6875" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                      <path d="M9.0625 9.375H10.9375" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    <span class="sidebar-menu-item__label">Companies</span>
                  </span>
                </button>
              </router-link>
            </nav>
          </div>

          <!-- Separator -->
          <div class="sidebar-separator"></div>
        </div>

        <!-- Bottom Menu -->
        <nav class="sidebar-menu sidebar-menu--bottom">
          <!-- Integrations -->
          <router-link to="/integrations" custom v-slot="{ navigate, isActive }">
            <button
              class="sidebar-menu-item"
              :class="{ 'sidebar-menu-item--active': isActive }"
              @click="navigate"
            >
              <span class="sidebar-menu-item__content">
                <svg class="sidebar-menu-item__icon" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="3.75" y="3.75" width="5" height="5" rx="0.625" stroke="currentColor" stroke-width="1.5"/>
                  <rect x="11.25" y="3.75" width="5" height="5" rx="0.625" stroke="currentColor" stroke-width="1.5"/>
                  <rect x="3.75" y="11.25" width="5" height="5" rx="0.625" stroke="currentColor" stroke-width="1.5"/>
                  <rect x="11.25" y="11.25" width="5" height="5" rx="0.625" stroke="currentColor" stroke-width="1.5"/>
                </svg>
                <span class="sidebar-menu-item__label">Integrations</span>
              </span>
            </button>
          </router-link>

          <!-- Settings -->
          <router-link to="/settings" custom v-slot="{ navigate, isActive }">
            <button
              class="sidebar-menu-item"
              :class="{ 'sidebar-menu-item--active': isActive }"
              @click="navigate"
            >
              <span class="sidebar-menu-item__content">
                <svg class="sidebar-menu-item__icon" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="10" cy="10" r="2.5" stroke="currentColor" stroke-width="1.5"/>
                  <path d="M16.1806 10.6944C16.1597 10.4667 16.1458 10.2361 16.1458 10C16.1458 9.76389 16.1597 9.53333 16.1806 9.30556L17.5 8.125L16.25 5.83333L14.6528 6.38889C14.2639 6.06944 13.8333 5.80556 13.3611 5.59722L13.125 3.75H10.625L10.3889 5.59722C9.91667 5.80556 9.48611 6.06944 9.09722 6.38889L7.5 5.83333L6.25 8.125L7.56944 9.30556C7.54861 9.53333 7.53472 9.76389 7.53472 10C7.53472 10.2361 7.54861 10.4667 7.56944 10.6944L6.25 11.875L7.5 14.1667L9.09722 13.6111C9.48611 13.9306 9.91667 14.1944 10.3889 14.4028L10.625 16.25H13.125L13.3611 14.4028C13.8333 14.1944 14.2639 13.9306 14.6528 13.6111L16.25 14.1667L17.5 11.875L16.1806 10.6944Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <span class="sidebar-menu-item__label">Settings</span>
              </span>
            </button>
          </router-link>
        </nav>
      </div>

      <!-- Footer -->
      <div class="sidebar-footer">
        <div class="sidebar-footer__content">
          <div class="sidebar-footer__avatar">
            <span>{{ userInitial }}</span>
          </div>
          <span class="sidebar-footer__name">{{ userName }}</span>
        </div>
        <button class="sidebar-footer__toggle">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M7.5 3.75L10 6.25L12.5 3.75" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M7.5 16.25L10 13.75L12.5 16.25" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>
    </aside>
  </div>
</template>

<script>
import userMixin from '@/mixins/userMixin';

export default {
  name: 'SidebarV2',
  mixins: [userMixin],
  props: {
    sidebarOpen: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    currentRoute() {
      return this.$route;
    },
    userName() {
      return this.$auth?.user?.name || "Marketing Team's";
    },
    userInitial() {
      return this.userName.charAt(0).toUpperCase();
    },
    isTasksActive() {
      return this.currentRoute.path.startsWith('/tasks');
    },
    isStatisticsActive() {
      return this.currentRoute.path.startsWith('/statistics');
    },
    isClientsActive() {
      return this.currentRoute.path.startsWith('/clients');
    }
  },
  methods: {
    toggleSidebar() {
      this.$emit('toggle-sidebar');
    }
  }
};
</script>

<style scoped>
.sidebar-v2 {
  --sidebar-width: 270px;
  --sidebar-bg: #f9f9f9;
  --border-color: #e4e4e4;
  --text-primary: #000000;
  --text-secondary: #727272;
  --bg-tertiary: #f2f2f2;
  --bg-selected: #f2f2f2;
}

/* Backdrop */
.sidebar-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.2);
  backdrop-filter: blur(4px);
  z-index: 40;
  opacity: 0;
  pointer-events: none;
  transition: opacity 200ms ease;
}

.sidebar-backdrop--visible {
  opacity: 1;
  pointer-events: auto;
}

@media (min-width: 1024px) {
  .sidebar-backdrop {
    display: none;
  }
}

/* Sidebar Container */
.sidebar-container {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 50;
  width: var(--sidebar-width);
  height: 100%;
  background: var(--sidebar-bg);
  border-right: 1px solid var(--border-color);
  transform: translateX(-100%);
  transition: transform 200ms ease;
}

.sidebar-container--open {
  transform: translateX(0);
}

@media (min-width: 1024px) {
  .sidebar-container {
    position: relative;
    transform: translateX(0);
    flex-shrink: 0;
  }
}

/* Top Content */
.sidebar-top {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 20px;
  width: 100%;
}

/* Logo Section - height: 72px, padding: 20px 28px, gap: 10px */
.sidebar-logo {
  display: flex;
  align-items: center;
  gap: 10px;
  height: 72px;
  padding: 20px 28px;
  border-bottom: 1px solid var(--border-color);
  position: relative;
  width: 100%;
  box-sizing: border-box;
}

.sidebar-logo__link {
  display: flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
}

.sidebar-logo__icon {
  width: 28px;
  height: 24px;
  flex-shrink: 0;
}

.sidebar-logo__text {
  font-family: 'Inter', sans-serif;
  font-weight: 500;
  font-size: 20px;
  line-height: 1.4;
  color: var(--text-primary);
}

/* Slider button - position: absolute, left: 234px, top: 22px, size: 28px */
.sidebar-slider {
  position: absolute;
  left: 234px;
  top: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  background: var(--bg-tertiary);
  border: none;
  border-radius: 2px;
  cursor: pointer;
  padding: 0;
}

.sidebar-slider:hover {
  background: #e8e8e8;
}

/* Main Container - gap: 20px */
.sidebar-main {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 20px;
  width: 100%;
}

/* Menu - gap: 4px, padding: 0 16px */
.sidebar-menu {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
  padding: 0 16px;
  width: 100%;
  box-sizing: border-box;
}

.sidebar-menu--database {
  padding: 0;
}

/* Bottom menu - gap: 8px */
.sidebar-menu--bottom {
  gap: 8px;
  padding: 0 16px;
}

/* Menu Item - height: 36px, padding: 8px, border-radius: 4px */
.sidebar-menu-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 36px;
  padding: 8px;
  background: transparent;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background 150ms ease;
  box-sizing: border-box;
}

.sidebar-menu-item:hover {
  background: var(--bg-selected);
}

.sidebar-menu-item--active {
  background: var(--bg-selected);
}

/* Menu Item Content - gap: 12px */
.sidebar-menu-item__content {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1 0 0;
  min-width: 1px;
  min-height: 1px;
}

/* Icon - size: 20px, color: #727272 */
.sidebar-menu-item__icon {
  flex-shrink: 0;
  width: 20px;
  height: 20px;
  color: var(--text-secondary);
}

/* Label - Inter Medium, 14px, line-height: 1.5, color: #727272 (inactive) / black (active) */
.sidebar-menu-item__label {
  font-family: 'Inter', sans-serif;
  font-weight: 500;
  font-size: 14px;
  line-height: 1.5;
  color: var(--text-secondary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.sidebar-menu-item--active .sidebar-menu-item__label {
  color: var(--text-primary);
}

/* Caret - size: 16px */
.sidebar-menu-item__caret {
  flex-shrink: 0;
  width: 16px;
  height: 16px;
  color: var(--text-secondary);
}

/* Separator - height: 1px */
.sidebar-separator {
  width: 100%;
  height: 1px;
  background: var(--border-color);
}

/* Section - gap: 5px, padding: 0 16px */
.sidebar-section {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 5px;
  padding: 0 16px;
  width: 100%;
  box-sizing: border-box;
}

/* Section Header - Inter Medium, 12px, line-height: 1.4, padding: 4px 8px */
.sidebar-section__header {
  padding: 4px 8px;
  font-family: 'Inter', sans-serif;
  font-weight: 500;
  font-size: 12px;
  line-height: 1.4;
  color: var(--text-secondary);
}

/* Footer - padding: 20px 16px, border-top */
.sidebar-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 16px;
  border-top: 1px solid var(--border-color);
  width: 100%;
  box-sizing: border-box;
}

/* Footer Content - gap: 12px */
.sidebar-footer__content {
  display: flex;
  align-items: center;
  gap: 12px;
}

/* Avatar - size: 32px, padding: 10px, border-radius: 4px */
.sidebar-footer__avatar {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  padding: 10px;
  background: var(--bg-tertiary);
  border-radius: 4px;
  flex-shrink: 0;
  box-sizing: border-box;
}

/* Avatar Text - Inter Medium, 14px */
.sidebar-footer__avatar span {
  font-family: 'Inter', sans-serif;
  font-weight: 500;
  font-size: 14px;
  line-height: normal;
  color: var(--text-primary);
}

/* Footer Name - Inter Medium, 16px, line-height: 1.5 */
.sidebar-footer__name {
  font-family: 'Inter', sans-serif;
  font-weight: 500;
  font-size: 16px;
  line-height: 1.5;
  color: var(--text-primary);
}

/* Footer Toggle - size: 20px */
.sidebar-footer__toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
  flex-shrink: 0;
  color: var(--text-primary);
}

.sidebar-footer__toggle:hover {
  opacity: 0.7;
}
</style>
