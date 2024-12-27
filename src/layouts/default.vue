<template>
  <div :class="$style.container">
    <header :class="$style.header">
      <nav :class="[$style.headerNav, 'container']">
        <ul :class="$style.headerNavList">
          <li>
            <NuxtLink to="/" class="text-white">Главная</NuxtLink>
          </li>
          <li>
            <NuxtLink :to="`/edit/${NOTE_ROUTE_PARAM_NEW}`" class="text-white">Создать заметку</NuxtLink>
          </li>
        </ul>
      </nav>
    </header>

    <main :class="$style.content">
      <slot />
    </main>

    <footer :class="$style.footer">
      <p>&copy; Декабрь 2024. Тестовое задание для компании `Небус`</p>
    </footer>
  </div>
</template>

<script lang="ts" setup>
import { NOTE_ROUTE_PARAM_NEW } from '@/consts'
</script>

<style lang="scss" module>
.container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.header {
  background-color: var(--bg-light-blue);
  color: var(--blue);
  padding: 4px 0;

  &Nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-weight: bold;

    &List {
      display: flex;
      gap: 20px;
      padding: 0;

      li {
        list-style: none;
      }
    }
  }
}

.content {
  display: flex;
  flex-direction: column;
  height: auto;
  flex: 1;
}

.footer {
  background-color: var(--bg-dark-blue);
  padding: 20px 0;
  text-align: center;
  color: var(--white);
}

@media (max-width: 1024px) {
  .headerNavList {
    gap: 16px;
  }
}

@media (max-width: 768px) {
  .header {
    padding: 8px 0;

    &Nav {
      flex-direction: column;
      align-items: flex-start;
    }

    &List {
      flex-direction: column;
      gap: 12px;
      align-items: flex-start;
    }
  }

  .footer {
    padding: 16px 0;
  }
}

@media (max-width: 480px) {
  .headerNavList {
    width: 100%;
    justify-content: center;
    font-size: 14px;
    gap: 16px;
  }

  .footer p {
    font-size: 12px;
  }
}

</style>
