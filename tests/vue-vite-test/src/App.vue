<script setup>
import siteSettings from './data/siteSettings.js?virtual-module';
import posts from './data/posts.js?virtual-module';
import authors from './data/authors.js?virtual-module';
</script>

<template>
  <header>
    <h1>{{ siteSettings.title }}</h1>
    <p>{{ siteSettings.description }}</p>
  </header>

  <main>
    <h2>Posts</h2>
    <div v-for="post in posts" :key="post._id" class="post">
      <h3>{{ post.title }}</h3>
      <p v-if="post.author">By: {{ post.author.name }}</p>
      <hr />
    </div>

    <h2>Authors</h2>
    <pre>{{ JSON.stringify(authors, null, 2) }}</pre>

    <h2>Site Settings Raw</h2>
    <pre>{{ JSON.stringify(siteSettings, null, 2) }}</pre>

    <h2>Posts Raw</h2>
    <pre>{{ JSON.stringify(posts, null, 2) }}</pre>
  </main>
</template>

<style scoped>
pre {
  background-color: #f4f4f4;
  padding: 1rem;
  border-radius: 5px;
  white-space: pre-wrap;
  word-wrap: break-word;
}
main {
  font-family: sans-serif;
}
.post {
  margin-bottom: 1rem;
}
</style>