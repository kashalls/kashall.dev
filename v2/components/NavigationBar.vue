<template>
  <b-navbar transparent wrapper-class="container">
    <template #brand>
      <b-navbar-item tag="router-link" :to="{ path: '/' }">
        <b-image :src="require('@/assets/img/jordanjones-colored.svg')" alt="Logo" />
      </b-navbar-item>
    </template>

    <template #end>
      <b-navbar-dropdown class="has-text-white" label="Keys" hoverable>
        <b-navbar-item href="https://github.com/kashalls.gpg">
          <span><iconify-icon icon="icon-park-solid:certificate" /> GPG</span>
        </b-navbar-item>
        <b-navbar-item href="https://github.com/kashalls.keys">
          <span><iconify-icon icon="mdi:ssh" /> SSH</span>
        </b-navbar-item>
        <b-navbar-item href="https://jordanjones.org/keybase.txt">
          <span><iconify-icon icon="fa6-brands:keybase" /> Keybase</span>
        </b-navbar-item>
      </b-navbar-dropdown>
      <b-navbar-dropdown class="has-text-white" label="Affilates" hoverable>
        <b-navbar-item href="https://p.hyper.expert/aff.php?aff=99">
          <span><iconify-icon icon="ant-design:cloud-filled" />  Hyper Expert</span>
        </b-navbar-item>
      </b-navbar-dropdown>
      <b-navbar-dropdown class="has-text-white" label="Projects" hoverable>
        <b-navbar-item tag="router-link" :to="{ path: '/eternity' }">
          <span><iconify-icon icon="fa-solid:money-check-alt" /> Eternity</span>
        </b-navbar-item>
        <b-navbar-item href="https://debugmc.info">
          <span><iconify-icon icon="mdi:minecraft" /> DebugMC</span>
          <b-tag rounded class="ml-1" type="is-info" size="is-small">
            Beta
          </b-tag>
        </b-navbar-item>
      </b-navbar-dropdown>
    </template>
  </b-navbar>
</template>
