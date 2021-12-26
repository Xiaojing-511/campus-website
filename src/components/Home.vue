<template>
    <main>
        <section>
            <article v-for="(item) in articles" :key="item.id">
                <p>{{item.contents}}</p>
            </article>
        </section>
    </main>
</template>
<script>
export default {
    data() {
        return {
            articles: []
        }
    },
    created(){
        this.articles = [
            {
                id: 1,
                contents: "1 Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderi"
            },
            {
                id: 2,
                contents: "2 Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderi"
            },
        ]
    }
}
</script>
<style lang="scss" scoped>
    main{
        section{
            article {
                width: 100%;
                background: #fff;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.05);
                border-radius: 10px;
                margin-bottom: 40px;
                font-size: 19px;
                line-height: 1.6em;
                p{
                    padding: 10px;
                }
            }
        }
    }
</style>