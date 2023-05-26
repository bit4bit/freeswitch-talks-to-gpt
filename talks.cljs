(ns talks
  (:require
   [promesa.core :as p]
   ["talksjs" :as talksjs]
   [talks.utils :as talksutils]
   ))

(def openai-token (or js/process.env.OPENAI_API_KEY (throw (js/Error. "requires environment var OPENAI_API_KEY"))))

(defn make-sentence-detector [detected-fn]
  (p/let [std (talksjs/sentenceDetector 500 detected-fn)]
    std))

(defn- data->sentence-detector [vad data]
  (if (instance? js/Buffer data)
    (.processAudio vad data)))

(defn- audio->text [audio-buffer]
  (talksutils/openai->speech-to-text "whisper-1" audio-buffer openai-token))

(defn- text->ia [text]
  (println (str "question: " text))
  (p/let [chat (talksutils/openai->create-chat openai-token)]
    (talksutils/openai->chat chat text)))

(defn- ia->speech [text]
  (println (str "response: " text))
  (p/rejected (ex-info "not implemented" {})))

(defn- audio->socket [audio-buffer socket]
  (p/rejected (ex-info "not implemented" {})))


(defn make-talk [socket]
  {:audio-buffer (atom #js[])
   :socket socket})

(defn talk-process-audio [{:keys [audio-buffer] :as session} sentence-detector data]
  (p/do
    (data->sentence-detector sentence-detector data)
    (swap! audio-buffer (fn [acc] (.push acc data) acc))))

(defn talk [{:keys [socket audio-buffer]}]
  (-> (audio->text (js/Buffer.concat @audio-buffer))
      (p/then text->ia)
      (p/then ia->speech)
      (p/then audio->socket socket)
      (p/catch (fn [err] (js/console.trace err)))))


(defn audio-close [code reason]
  (println "close websocket"))

(defn audio-handler [session sentence-detector message]
  (-> (talk-process-audio session sentence-detector message)
      (p/catch (fn [err]
                 (js/console.trace "audio-handler error:" err)))))
