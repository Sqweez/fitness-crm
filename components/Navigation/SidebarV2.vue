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
              <path d="M6.25 7.5L3.75 10L6.25 12.5" stroke="#AFAFAF" stroke-width="1.5" stroke-linecap="round"
                    stroke-linejoin="round" />
              <path d="M13.75 7.5L16.25 10L13.75 12.5" stroke="#AFAFAF" stroke-width="1.5" stroke-linecap="round"
                    stroke-linejoin="round" />
            </svg>
          </button>
        </div>

        <!-- Main Container -->
        <div class="sidebar-main">
          <!-- Primary Menu -->
          <nav class="sidebar-menu">
            <!-- Главная -->
            <router-link to="/" custom v-slot="{ navigate, isExactActive }">
              <button
                class="sidebar-menu-item"
                :class="{ 'sidebar-menu-item--active': isExactActive }"
                @click="navigate"
              >
                <span class="sidebar-menu-item__content">
                  <svg class="sidebar-menu-item__icon" width="20" height="20" viewBox="0 0 20 20" fill="none"
                       xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M12.5 3.125H4.375C4.02982 3.125 3.75 3.40482 3.75 3.75V16.25C3.75 16.5952 4.02982 16.875 4.375 16.875H15.625C15.9702 16.875 16.25 16.5952 16.25 16.25V6.875L12.5 3.125Z"
                      stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M12.5 3.125V6.875H16.25" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"
                          stroke-linejoin="round" />
                  </svg>
                  <span class="sidebar-menu-item__label">Главная</span>
                </span>
              </button>
            </router-link>

            <!-- Клиенты -->
            <router-link to="/clients" custom v-slot="{ navigate, isActive }">
              <button
                class="sidebar-menu-item"
                :class="{ 'sidebar-menu-item--active': isActive || isClientsActive }"
                @click="navigate"
              >
                <span class="sidebar-menu-item__content">
                  <svg class="sidebar-menu-item__icon" width="20" height="20" viewBox="0 0 20 20" fill="none"
                       xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M12.5 3.125H4.375C4.02982 3.125 3.75 3.40482 3.75 3.75V16.25C3.75 16.5952 4.02982 16.875 4.375 16.875H15.625C15.9702 16.875 16.25 16.5952 16.25 16.25V6.875L12.5 3.125Z"
                      stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M12.5 3.125V6.875H16.25" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"
                          stroke-linejoin="round" />
                  </svg>
                  <span class="sidebar-menu-item__label">Клиенты</span>
                </span>
              </button>
            </router-link>

            <!-- Сотрудники (IS_BOSS only) -->
            <router-link v-if="IS_BOSS" to="/users" custom v-slot="{ navigate, isActive }">
              <button
                class="sidebar-menu-item"
                :class="{ 'sidebar-menu-item--active': isActive || isUsersActive }"
                @click="navigate"
              >
                <span class="sidebar-menu-item__content">
                  <svg class="sidebar-menu-item__icon" width="20" height="20" viewBox="0 0 20 20" fill="none"
                       xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M12.5 3.125H4.375C4.02982 3.125 3.75 3.40482 3.75 3.75V16.25C3.75 16.5952 4.02982 16.875 4.375 16.875H15.625C15.9702 16.875 16.25 16.5952 16.25 16.25V6.875L12.5 3.125Z"
                      stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M12.5 3.125V6.875H16.25" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"
                          stroke-linejoin="round" />
                  </svg>
                  <span class="sidebar-menu-item__label">Сотрудники</span>
                </span>
              </button>
            </router-link>

            <!-- Прайс (IS_BOSS only) -->
            <router-link v-if="IS_BOSS" to="/commerce/services" custom v-slot="{ navigate, isActive }">
              <button
                class="sidebar-menu-item"
                :class="{ 'sidebar-menu-item--active': isActive || isServicesActive }"
                @click="navigate"
              >
                <span class="sidebar-menu-item__content">
                  <svg class="sidebar-menu-item__icon" width="20" height="20" viewBox="0 0 20 20" fill="none"
                       xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M12.5 3.125H4.375C4.02982 3.125 3.75 3.40482 3.75 3.75V16.25C3.75 16.5952 4.02982 16.875 4.375 16.875H15.625C15.9702 16.875 16.25 16.5952 16.25 16.25V6.875L12.5 3.125Z"
                      stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M12.5 3.125V6.875H16.25" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"
                          stroke-linejoin="round" />
                  </svg>
                  <span class="sidebar-menu-item__label">Прайс</span>
                </span>
              </button>
            </router-link>

            <!-- Магазин (IS_BOSS only) -->
            <router-link v-if="IS_BOSS" to="/commerce/products" custom v-slot="{ navigate, isActive }">
              <button
                class="sidebar-menu-item"
                :class="{ 'sidebar-menu-item--active': isActive || isProductsActive }"
                @click="navigate"
              >
                <span class="sidebar-menu-item__content">
                  <svg class="sidebar-menu-item__icon" width="20" height="20" viewBox="0 0 20 20" fill="none"
                       xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M12.5 3.125H4.375C4.02982 3.125 3.75 3.40482 3.75 3.75V16.25C3.75 16.5952 4.02982 16.875 4.375 16.875H15.625C15.9702 16.875 16.25 16.5952 16.25 16.25V6.875L12.5 3.125Z"
                      stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M12.5 3.125V6.875H16.25" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"
                          stroke-linejoin="round" />
                  </svg>
                  <span class="sidebar-menu-item__label">Магазин</span>
                </span>
              </button>
            </router-link>
          </nav>

          <!-- Separator -->
          <div class="sidebar-separator"></div>

          <!-- Statistics Section (IS_BOSS only) -->
          <div v-if="IS_BOSS" class="sidebar-section">
            <div class="sidebar-section__header">СТАТИСТИКА</div>
            <nav class="sidebar-menu sidebar-menu--section">
              <!-- Общие данные -->
              <router-link to="/statistics/common" custom v-slot="{ navigate, isActive }">
                <button
                  class="sidebar-menu-item"
                  :class="{ 'sidebar-menu-item--active': isActive }"
                  @click="navigate"
                >
                  <span class="sidebar-menu-item__content">
                    <svg class="sidebar-menu-item__icon" width="20" height="20" viewBox="0 0 20 20" fill="none"
                         xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M12.5 3.125H4.375C4.02982 3.125 3.75 3.40482 3.75 3.75V16.25C3.75 16.5952 4.02982 16.875 4.375 16.875H15.625C15.9702 16.875 16.25 16.5952 16.25 16.25V6.875L12.5 3.125Z"
                        stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                      <path d="M12.5 3.125V6.875H16.25" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"
                            stroke-linejoin="round" />
                    </svg>
                    <span class="sidebar-menu-item__label">Общие данные</span>
                  </span>
                </button>
              </router-link>

              <!-- Экономика -->
              <router-link to="/statistics/economy" custom v-slot="{ navigate, isActive }">
                <button
                  class="sidebar-menu-item"
                  :class="{ 'sidebar-menu-item--active': isActive }"
                  @click="navigate"
                >
                  <span class="sidebar-menu-item__content">
                    <svg class="sidebar-menu-item__icon" width="20" height="20" viewBox="0 0 20 20" fill="none"
                         xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M12.5 3.125H4.375C4.02982 3.125 3.75 3.40482 3.75 3.75V16.25C3.75 16.5952 4.02982 16.875 4.375 16.875H15.625C15.9702 16.875 16.25 16.5952 16.25 16.25V6.875L12.5 3.125Z"
                        stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                      <path d="M12.5 3.125V6.875H16.25" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"
                            stroke-linejoin="round" />
                    </svg>
                    <span class="sidebar-menu-item__label">Экономика</span>
                  </span>
                </button>
              </router-link>

              <!-- Магазин/Бар -->
              <router-link to="/statistics/shop" custom v-slot="{ navigate, isActive }">
                <button
                  class="sidebar-menu-item"
                  :class="{ 'sidebar-menu-item--active': isActive }"
                  @click="navigate"
                >
                  <span class="sidebar-menu-item__content">
                    <svg class="sidebar-menu-item__icon" width="20" height="20" viewBox="0 0 20 20" fill="none"
                         xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M12.5 3.125H4.375C4.02982 3.125 3.75 3.40482 3.75 3.75V16.25C3.75 16.5952 4.02982 16.875 4.375 16.875H15.625C15.9702 16.875 16.25 16.5952 16.25 16.25V6.875L12.5 3.125Z"
                        stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                      <path d="M12.5 3.125V6.875H16.25" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"
                            stroke-linejoin="round" />
                    </svg>
                    <span class="sidebar-menu-item__label">Магазин/Бар</span>
                  </span>
                </button>
              </router-link>

              <!-- Прайс -->
              <router-link to="/statistics/price" custom v-slot="{ navigate, isActive }">
                <button
                  class="sidebar-menu-item"
                  :class="{ 'sidebar-menu-item--active': isActive }"
                  @click="navigate"
                >
                  <span class="sidebar-menu-item__content">
                    <svg class="sidebar-menu-item__icon" width="20" height="20" viewBox="0 0 20 20" fill="none"
                         xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M12.5 3.125H4.375C4.02982 3.125 3.75 3.40482 3.75 3.75V16.25C3.75 16.5952 4.02982 16.875 4.375 16.875H15.625C15.9702 16.875 16.25 16.5952 16.25 16.25V6.875L12.5 3.125Z"
                        stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                      <path d="M12.5 3.125V6.875H16.25" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"
                            stroke-linejoin="round" />
                    </svg>
                    <span class="sidebar-menu-item__label">Прайс</span>
                  </span>
                </button>
              </router-link>

              <!-- Заканчивающиеся безлимиты -->
              <router-link to="/statistics/unlimited-ending" custom v-slot="{ navigate, isActive }">
                <button
                  class="sidebar-menu-item"
                  :class="{ 'sidebar-menu-item--active': isActive }"
                  @click="navigate"
                >
                  <span class="sidebar-menu-item__content">
                    <svg class="sidebar-menu-item__icon" width="20" height="20" viewBox="0 0 20 20" fill="none"
                         xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M12.5 3.125H4.375C4.02982 3.125 3.75 3.40482 3.75 3.75V16.25C3.75 16.5952 4.02982 16.875 4.375 16.875H15.625C15.9702 16.875 16.25 16.5952 16.25 16.25V6.875L12.5 3.125Z"
                        stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                      <path d="M12.5 3.125V6.875H16.25" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"
                            stroke-linejoin="round" />
                    </svg>
                    <span class="sidebar-menu-item__label">Заканчивающиеся безлимиты</span>
                  </span>
                </button>
              </router-link>
            </nav>
          </div>

          <!-- Separator -->
          <div v-if="IS_BOSS" class="sidebar-separator"></div>

          <!-- Requests Section (IS_BOSS only) -->
          <div v-if="IS_BOSS" class="sidebar-section">
            <div class="sidebar-section__header">ЗАПРОСЫ</div>
            <nav class="sidebar-menu sidebar-menu--section">
              <!-- Штрафные тренировки -->
              <router-link to="/requests/clients/penalty" custom v-slot="{ navigate, isActive }">
                <button
                  class="sidebar-menu-item"
                  :class="{ 'sidebar-menu-item--active': isActive }"
                  @click="navigate"
                >
                  <span class="sidebar-menu-item__content">
                    <svg class="sidebar-menu-item__icon" width="20" height="20" viewBox="0 0 20 20" fill="none"
                         xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M12.5 3.125H4.375C4.02982 3.125 3.75 3.40482 3.75 3.75V16.25C3.75 16.5952 4.02982 16.875 4.375 16.875H15.625C15.9702 16.875 16.25 16.5952 16.25 16.25V6.875L12.5 3.125Z"
                        stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                      <path d="M12.5 3.125V6.875H16.25" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"
                            stroke-linejoin="round" />
                    </svg>
                    <span class="sidebar-menu-item__label">Штрафные тренировки</span>
                  </span>
                </button>
              </router-link>

              <!-- Восстановления -->
              <router-link to="/requests/clients/restored" custom v-slot="{ navigate, isActive }">
                <button
                  class="sidebar-menu-item"
                  :class="{ 'sidebar-menu-item--active': isActive }"
                  @click="navigate"
                >
                  <span class="sidebar-menu-item__content">
                    <svg class="sidebar-menu-item__icon" width="20" height="20" viewBox="0 0 20 20" fill="none"
                         xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M12.5 3.125H4.375C4.02982 3.125 3.75 3.40482 3.75 3.75V16.25C3.75 16.5952 4.02982 16.875 4.375 16.875H15.625C15.9702 16.875 16.25 16.5952 16.25 16.25V6.875L12.5 3.125Z"
                        stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                      <path d="M12.5 3.125V6.875H16.25" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"
                            stroke-linejoin="round" />
                    </svg>
                    <span class="sidebar-menu-item__label">Восстановления</span>
                  </span>
                </button>
              </router-link>
            </nav>
          </div>

          <!-- Separator -->
          <div v-if="IS_BOSS" class="sidebar-separator"></div>
        </div>
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
            <path d="M7.5 6.25L10 3.75L12.5 6.25" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M7.5 13.75L10 16.25L12.5 13.75" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
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
      return this.$auth?.user?.name || 'User';
    },
    userInitial() {
      return this.userName.charAt(0).toUpperCase();
    },
    isClientsActive() {
      return this.currentRoute.path.startsWith('/clients');
    },
    isUsersActive() {
      return this.currentRoute.path.startsWith('/users');
    },
    isServicesActive() {
      return this.currentRoute.path.startsWith('/commerce/services');
    },
    isProductsActive() {
      return this.currentRoute.path.startsWith('/commerce/products');
    }
  },
  methods: {
    toggleSidebar() {
      this.$emit('close-sidebar');
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
  overflow-y: auto;
}

/* Logo Section - height: 72px, padding: 20px 28px, gap: 10px */
.sidebar-logo {
  display: flex;
  align-items: center;
  gap: 10px;
  height: 64px;
  padding: 20px 28px;
  border-bottom: 1px solid var(--border-color);
  position: relative;
  width: 100%;
  box-sizing: border-box;
  flex-shrink: 0;
}

.sidebar-logo__link {
  display: flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
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

.sidebar-menu--section {
  padding: 0;
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
  flex-shrink: 0;
}

/* Footer Content - gap: 12px */
.sidebar-footer__content {
  display: flex;
  align-items: center;
  gap: 12px;
}

/* Avatar - size: 32px, border-radius: 4px */
.sidebar-footer__avatar {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: var(--bg-tertiary);
  border-radius: 4px;
  flex-shrink: 0;
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
