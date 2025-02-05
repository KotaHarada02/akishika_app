<template>
  <div class="container">
    <LogoHeader />
    <div class="questionnaire-container">
      <div class="question-column">
        <h2>質問 {{ currentQuestionIndex + 1 }}</h2>
        <h3>{{ currentQuestion.text }}</h3>
        <div 
          v-for="(option, index) in currentQuestion.options" 
          :key="index" 
          class="option"
          @click="selectOption(option, index)"
        >
          {{ option.text }}
        </div>
      </div>
      <div class="nav-buttons">
        <button @click="prevQuestion" :disabled="currentQuestionIndex === 0">戻る</button>
      </div>
    </div>
  </div>
</template>

<script>
import LogoHeader from '~/components/LogoHeader.vue'

export default {
  components: {
    LogoHeader
  },
  data() {
    return {
      currentQuestionIndex: 0,
      userAnswers: [],
      userRoute: [],
      // 質問の項目
      questionTree: {
        text: "どのように秋鹿を選びたい?",
        options: [
          {
            text: "日本酒の味で選びたい",
            next: {
              text: "味の好みは?",
              options: [
                {
                  text: "甘口",
                  next: {
                    text: "香りの好みは?",
                    options: [
                      { text: "フレッシュ" },
                      { text: "熟成" }
                    ]
                  }
                },
                {
                  text: "辛口",
                  next: {
                    text: "香りの好みは?",
                    options: [
                      { text: "フレッシュ" },
                      { text: "熟成" }
                    ]
                  }
                }
              ]
            }
          },
          {
            text: "普段飲むお酒から選びたい",
            next: {
              text: "普段飲むお酒は?",
              options: [
                { text: "ハイボール・ビール" },
                {
                  text: "焼酎・果実酒",
                  next: {
                    text: "味の好みは?",
                    options: [
                      { text: "甘い" },
                      { text: "スッキリ" }
                    ]
                  }
                },
                {
                  text: "ウイスキー",
                  next: {
                    text: "ボディの好みは?",
                    options: [
                      { text: "重い" },
                      { text: "軽い" }
                    ]
                  }
                },
                {
                  text: "ワイン",
                  next: {
                    text: "赤ワインor白ワイン?",
                    options: [
                      { text: "赤ワイン" },
                      { text: "白ワイン" }
                    ]
                  }
                }
              ]
            }
          },
          {
            text: "食べ物と合わせたい",
            next: {
              text: "何を食べるか?",
              options: [
                {
                  text: "ラーメン",
                  next: {
                    text: "何ラーメンか?",
                    options: [
                      { text: "赤味噌" },
                      { text: "白味噌" },
                      { text: "辛味噌" },
                      { text: "TOYONO" },
                      { text: "VEGAN担々麺" },
                      { text: "つけ麺8号・焦かし味噌北海道" },
                      { text: "ベジみそ" }
                    ]
                  }
                },
                {
                  text: "一品",
                  next: {
                    text: "なんの一品か?",
                    options: [
                      { text: "味噌漬けチャーシューカルパッチョ" },
                      { text: "シン発酵唐揚げ" },
                      { text: "おでん" },
                      { text: "地元野菜のピクルス・とろりん煮卵のポテサラ・季節の野菜盛り合わせ・発酵ポテトフライ" },
                      { text: "発酵フィッシュ&チップス" },
                      { text: "自家製ラー油ダレの冷奴・肉味噌の温奴・厚揚げと醤油麹" },
                    ]
                  }
                },
                {
                  text: "デザート",
                  next: {
                    text: "なんのデザートか?",
                    options: [
                      { text: "本日のアイス" },
                      { text: "アイスクリン・チーズケーキ" }
                    ]
                  }
                }
              ]
            }
          }
        ]
      }
    }
  },
  computed: {
    currentQuestion() {
      let question = this.questionTree;
      for (let answer of this.userAnswers) {
        if (question.options[answer].next) {
          question = question.options[answer].next;
        } else {
          break;
        }
      }
      return question;
    },
    questionIdentifier() {
      return this.userAnswers
        .map(answer => answer + 1)
        .reduce((acc, val, index, arr) => acc + val * Math.pow(10, arr.length - index - 1), 0);
    }
  },
  methods: {
    selectOption(option, index) {
      this.userAnswers.push(index);
      this.userRoute.push(option.text);
      if (option.next) {
        this.currentQuestionIndex++;
      } else {
        this.navigateToRecommendPage();
      }
    },
    prevQuestion() {
      if (this.currentQuestionIndex > 0) {
        this.currentQuestionIndex--;
        this.userAnswers.pop();
        this.userRoute.pop();
      }
    },
    navigateToRecommendPage() {
      this.$router.push({
        name: 'recommend',
        query: { answers: JSON.stringify(this.userAnswers), route: JSON.stringify(this.userRoute), identifier: this.questionIdentifier }
      });
    }
  }
};
</script>

<style scoped>
.container {
  min-height: 100vh;
  background-color: #ffffff;
}

.questionnaire-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  max-width: 600px;
  margin: 0 auto;
}

.question-column {
  width: 100%;
  margin-bottom: 20px;
}

.option {
  margin: 10px 0;
  padding: 10px;
  border-radius: 5px;
  box-shadow: 0 10px 25px 0 rgba(0, 0, 0, 0.1);
  background-color: #F9D5BC; /* 統一された背景色 */
  color: #374151; /* 文字色 */
  font-weight: bold;
  text-align: center;
}

.nav-buttons {
  margin-top: 20px;
}

button {
  padding: 10px 20px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}
</style>
