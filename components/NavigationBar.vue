<template>
  <b-navbar transparent>
    <template #brand>
      <b-navbar-item tag="router-link" :to="{ path: '/' }">
        <b-image
          :src="require('@/assets/img/jordanjones-colored.svg')"
          alt="Logo"
        />
      </b-navbar-item>
    </template>

    <template #end>
      <b-navbar-dropdown class="has-text-white" label="Keys" hoverable>
        <b-navbar-item href="https://github.com/kashalls.gpg">
          GPG
        </b-navbar-item>
        <b-navbar-item href="https://github.com/kashalls.keys">
          SSH
        </b-navbar-item>
        <b-navbar-item href="https://jordanjones.org/keybase.txt">
          Keybase
        </b-navbar-item>
      </b-navbar-dropdown>
      <b-navbar-item href="https://jordanjones.org/discord">
        <i class="fab fa-discord" /> <span class="pl-1">Discord</span>
      </b-navbar-item>
      <b-navbar-item href="https://debugmc.info">
        <i class="fas fa-cubes" /> <span class="pl-1">DebugMC</span>
      </b-navbar-item>
    </template>
  </b-navbar>
</template>
