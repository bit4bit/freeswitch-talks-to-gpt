(ns talks-test
  (:require [cljs.test :as t :refer [async deftest is testing]]
            [promesa.core :as p]
            ["fs" :as fs]
            [talks.utils :refer [openai->speech-to-text openai->create-chat openai->chat]]))
;;https://github.com/babashka/nbb/blob/01598eee300b8a0d6faad40a72730291808077e0/doc/testing/example.cljs

(def openai-token (or js/process.env.OPENAI_API_KEY (throw (js/Error. "requires environment var OPENAI_API_KEY"))))

(deftest openai-transcribe
  (testing "transcribe audio"
    (async done
           (-> (p/let [data (fs/readFileSync "hello.wav")
                      transcription (openai->speech-to-text "whisper-1" data openai-token)]
                (is (= "Hello." transcription)))
               (p/finally done)))))
(deftest openai-chat
  (testing "chat with gpt"
    (async done
           (-> (p/let [chat (openai->create-chat openai-token)
                       answer (openai->chat chat "respond only \"pong\"")]
                 (is (= "pong" answer)))
               (p/finally done)))))


(t/run-tests)
