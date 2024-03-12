<script setup lang="ts">
const createdAt = new Date(import.meta.env.V_CREATED_TIME).getFullYear()
const dateStr = `${createdAt} - ${new Date().getFullYear()}`
const myLink = import.meta.env.V_LINK
const myName = import.meta.env.V_AUTHOR
const myTitle = import.meta.env.V_TITLE
const myEmail = import.meta.env.V_EMAIL
const mailTo = `mailto:${myEmail}?subject=From ${myTitle}`
const myUrl = import.meta.env.V_URL
const myGithub = import.meta.env.V_GITHUB
const icp = import.meta.env.V_ICP
const icpLink = import.meta.env.V_ICP_LINK
const beian = import.meta.env.V_BEIAN
const beianLink = import.meta.env.V_BEIAN_LINK
</script>

<template>
  <footer>
    <div class="text-3.6">
      <ul class="m-0 flex select-none list-none gap-4 p-0 all:transition-150">
        <li v-if="myGithub" class="h-9 w-9 flex-shrink-0 cursor-pointer">
          <a :href="myGithub" class="h-100% w-100% flex flex-justify-center flex-items-center rd-100 bg-gray-100 text-gray-500 no-underline dark:bg-gray-800 hover:bg-gray-200 hover:text-gray-700 dark:hover:bg-gray-400"><i class="fa-brands fa-github" /></a>
        </li>
        <li v-if="myEmail" class="h-9 w-9 flex-shrink-0 cursor-pointer">
          <a :href="mailTo" class="h-100% w-100% flex flex-justify-center flex-items-center rd-100 bg-gray-100 text-gray-500 no-underline dark:bg-gray-800 hover:bg-gray-200 hover:text-gray-700 dark:hover:bg-gray-400"><i class="fa-solid fa-envelope" /></a>
        </li>
        <li class="h-9 w-9 flex-shrink-0 cursor-pointer">
          <a href="//www.travellings.cn/" target="_blank" class="h-100% w-100% flex flex-justify-center flex-items-center rd-100 bg-gray-100 text-gray-500 no-underline dark:bg-gray-800 hover:bg-gray-200 hover:text-gray-700 dark:hover:bg-gray-400"><i class="fa-solid fa-train" /></a>
        </li>
      </ul>
      <p v-if="icp || beian" class="m-0 mt-6 align-middle text-gray-400">
        <span v-if="icp">
          <svg t="1709883831847" class="icon mr-1 h-5 w-5 translate-y-1.3" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="39557" width="200" height="200"><path d="M483.328 59.946667l-30.848 25.557333-12.16 9.557333-10.922667 7.893334-6.485333 4.522666c-66.048 45.482667-140.586667 70.784-239.786667 70.784a38.4 38.4 0 0 0-36.565333 26.496l-3.925333 12.928-6.826667 25.514667-1.92 7.722667c-8.533333 35.285333-15.786667 73.472-20.608 113.194666-13.994667 115.498667-5.546667 220.928 35.114667 306.474667 61.44 129.237333 178.773333 218.112 349.013333 266.453333a38.4 38.4 0 0 0 22.186667-0.341333c172.842667-55.381333 289.706667-143.914667 347.776-266.112 35.498667-74.666667 45.056-169.301333 35.925333-276.224a1056.085333 1056.085333 0 0 0-27.690667-165.930667l-6.058666-22.613333a38.4 38.4 0 0 0-36.821334-27.562667c-91.605333 0-166.442667-25.557333-236.501333-71.338666l-14.08-9.386667-8.874667-6.314667-14.677333-10.922666-26.965333-21.034667a38.4 38.4 0 0 0-48.298667 0.682667z m7.936 92.672l17.408-13.824 4.138667 3.157333c15.616 11.946667 25.941333 19.2 41.386666 29.312l13.738667 8.661333c68.864 42.368 143.146667 68.437333 229.546667 74.026667l5.333333 0.213333 1.92 7.936c9.386667 40.192 17.706667 88.021333 22.016 138.837334 8.106667 94.549333-0.170667 176.64-28.714667 236.672l-5.333333 10.752c-48.042667 92.117333-140.672 162.218667-280.192 209.792l-5.248 1.706666 11.093333 3.328c-150.186667-42.666667-249.386667-117.802667-300.586666-225.578666-33.28-69.973333-40.618667-161.877333-28.245334-264.277334 4.437333-36.522667 11.093333-71.722667 18.986667-104.234666l3.712-14.762667 4.778667-0.213333c99.413333-5.376 178.986667-34.816 249.514666-83.413334 8.362667-5.76 16.512-11.733333 24.746667-18.090666z" fill="currentColor" p-id="39558" /><path d="M626.517333 381.184a38.4 38.4 0 0 1 60.544 47.018667l-3.2 4.096-190.293333 213.333333a38.4 38.4 0 0 1-52.053333 4.906667l-3.754667-3.285334-112.981333-112.981333a38.4 38.4 0 0 1 50.346666-57.770667l3.968 3.456 84.181334 84.224 163.242666-182.997333z" fill="currentColor" p-id="39559" /></svg>
          <span>ICP 备案号：</span>
          <a :href="icpLink" target="_blank" class="text-gray-300 dark:text-gray-500 dark:hover:c-primary">{{ icp }}</a>
        </span>
        <span v-if="beian" class="ml-2">
          <span>公安备案号：</span>
          <a :href="beianLink" class="text-gray-300 dark:text-gray-500 dark:hover:c-primary">{{ beian }}</a>
        </span>
      </p>
      <p class="mb-6 mt-2 align-middle text-gray-400">
        <a v-if="myLink && myName" :href="myUrl" class="text-gray-300 dark:text-gray-500 dark:hover:c-primary">{{ myTitle }},</a>
        <span class="mx-1">{{ dateStr }}</span>
        <span class="mx-1">&copy; Powered by</span>
        <a v-if="myLink && myName" :href="myLink" class="text-gray-300 dark:text-gray-500 dark:hover:c-primary">{{ myName }}</a>
      </p>
    </div>
  </footer>
</template>
