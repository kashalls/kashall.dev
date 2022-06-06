<template>
  <div class="container">
    <h1 class="title mb-0 pb-0 has-text-white">
      jordan jones
    </h1>
    <p class="mail-link">
      <a href="mailto:kashall@jordanjones.org">kashall@jordanjones.org</a>
    </p>
    <h2 class="subtitle mt-3">
      <span id="first">developer</span>
      <span id="second">mercy main</span>
      <span id="third" onclick="location='https://ifunny.co/user/Linas'"><br>memer</span>
      <span id="fourth">systems intergrator</span>
      <span id="fifth" onclick="location='https://www.youtube.com/watch?v=dQw4w9WgXcQ'">and
        more</span>
    </h2>
    <LinkContainer />
  </div>
</template>

<script>
import LinkContainer from './LinkContainer.vue'
export default {
  name: 'KashallCard',
  components: { LinkContainer }
}
</script>

<style scoped>
.title {
    text-decoration: dotted;
    box-shadow: #0F2027;
    font-size: 2em;
}

.subtitle span:nth-child(0) {
    color: #aaa
}

.subtitle span:nth-child(1) {
    color: #4087ED;
}

.subtitle span:nth-child(2) {
    color: #F9A532;
}

.subtitle span:nth-child(3) {
    color: #ac39ac;
}

.subtitle span:nth-child(4) {
    color: #dc3b3b;
}

.subtitle span:nth-child(5) {
    color: #00aba5
}

.subtitle {
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
}

.subtitle span::after {
    content: ";"
}

.mail-link {
    line-height: 25px;
    margin: 0 !important;
    transition: filter 0.2s ease, transform 0.4s ease;
}

.mail-link:hover {
    filter: brightness(-1.6);
}
</style>
