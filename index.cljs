(ns main
  (:require
   [promesa.core :as p]
   ["ws" :as ws]
   [talks]))

(def port 8000)

(println (str "listening audio at port " port))
(-> (ws/WebSocketServer. #js{:port port})
    (.on "connection"
         (fn [socket req]
           (p/let [session (talks/make-talk socket)
                   std (talks/make-sentence-detector #(talks/talk session))]
             (.on socket "message" #(talks/audio-handler session std %))
             (.on socket "close" talks/audio-close)))))
