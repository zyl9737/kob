<template>
    <PlayGround v-if="$store.state.pk.status === 'playing'" />
    <MatchGround v-if="$store.state.pk.status === 'matching'" />
    <ResultBoard v-if="$store.state.pk.loser != 'none'" />
</template>

<script>
import MatchGround from "@/components/MatchGround.vue";
import PlayGround from "@/components/PlayGround.vue";
import ResultBoard from "@/components/ResultBoard.vue";
import { onMounted, onUnmounted } from "vue";
import { useStore } from "vuex";

export default {
    components: {
        PlayGround,
        MatchGround,
        ResultBoard,
    },
    setup() {
        const store = useStore();

        let socket = null;
        let socket_url = `ws://localhost:3000/websocket/${store.state.user.jwt_token}/`;

        onMounted(() => {
            socket = new WebSocket(socket_url);

            store.commit("updateOpponent", {
                username: "我的对手",
                photo: "https://cdn.acwing.com/media/article/image/2022/08/09/1_1db2488f17-anonymous.png",
            });

            socket.onopen = () => {  // 链接成功建立后会执行
                console.log("Connected!");
                store.commit("updateSocket", socket);
            };

            socket.onmessage = (msg) => {  // 接收到后端消息时会执行
                const data = JSON.parse(msg.data);  // Spring传过来的数据是放在消息的data中
                console.log(data);

                if (data.event === "match_success") {
                    store.commit("updateOpponent", {
                        username: data.opponent_username,
                        photo: data.opponent_photo,
                    });

                    setTimeout(() => {
                        store.commit("updateStatus", "playing");
                    }, 3000);
                    store.commit("updateGame", data.game); // 更新游戏内容

                } else if (data.event === "move") {
                    console.log(data);
                    const gameObject = store.state.pk.gameObject;
                    const [snake0, snake1] = gameObject.snakes;
                    snake0.set_direction(data.a_direction);
                    snake1.set_direction(data.b_direction);
                    } else if (data.event === "result") {  // 游戏结束
                    const gameObject = store.state.pk.gameObject;
                    const [snake0, snake1] = gameObject.snakes;
                    if (data.loser === "all" || data.loser === "A") {
                        snake0.status = "die";
                    }
                    if (data.loser === "all" || data.loser === "B") {
                        snake1.status = "die";
                    }
                    store.commit("updateLoser", data.loser);
                }
            };

            socket.onclose = () => {  // 关闭链接后会执行
                console.log("Disconnected!");
            };
        });

        onUnmounted(() => {
            socket.close();  // 如果不断开链接每次切换页面都会创建新链接，就会导致有很多冗余链接
            store.commit("updateStatus", "matching");  // 进入游戏地图后玩家点击其他页面应该是默认退出游戏
        });
    },
};
</script>

<style scoped></style>