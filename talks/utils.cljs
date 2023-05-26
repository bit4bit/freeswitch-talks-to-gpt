(ns talks.utils
  (:require [promesa.core :as p]
            ["fs" :as fs]
            ["fs/promises" :as fs-p]
            ["wav" :as wav]
            ["stream" :as stream]
            ["stream/promises" :as stream-promises]
            ["openai" :as openai]
            ["tempfile$default" :as tempfile]))

(def openai-transcription-url "https://api.openai.com/v1/audio/transcriptions")

(declare Buffer->to-wav)

(defn openai->speech-to-text [model audio-buffer token]
  (p/let [form (js/FormData.)
          audio-wav (Buffer->to-wav audio-buffer)
          audio-blob (js/Blob. [audio-wav])]
    (.append form "file" audio-blob "audio.wav")
    (.append form "model" model)
    (.append form "response_format" "text")
    (p/let [resp
            (js/fetch openai-transcription-url #js{:method "POST",
                                                   :body form
                                                   :headers #js{
                                                                :Authorization (str "Bearer " token)
                                                                }
                                                   })
            text (.text resp)]
      (.trim text)
      )
    ))

(defn openai->create-chat [token]
  (let [conf (openai/Configuration. #js{:apiKey token})
        chat (openai/OpenAIApi. conf)]
    {:chat chat :messages (atom []) :model "gpt-3.5-turbo"}
    ))

(defn- user-message< [messages message]
  (swap! messages conj {:role "user" :content message}))
(defn- assistant-message< [messages message]
  (swap! messages conj {:role "assistant" :content message}))

(defn openai->chat [{:keys [chat messages model]} message]
  (p/let [_ (user-message< messages message)
          completion (.createChatCompletion chat (clj->js {:model model :messages @messages}))
          content (get-in (js->clj completion) ["data" "choices" 0 "message" "content"])]
    (assistant-message< messages content)
    content
    ))

(defn- Buffer->to-wav [buffer]
  (let [tmpname (tempfile)
        in-pcm (stream/PassThrough.)
        out-wav (wav/FileWriter. tmpname #js{:sampleRate 16000 :channels 1})]
    (.end in-pcm buffer)
    (->
     (stream-promises/pipeline in-pcm out-wav)
     (p/then #(fs-p/readFile tmpname))
     )))
