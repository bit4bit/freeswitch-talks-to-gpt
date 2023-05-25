# freeswitch-talks-to-gpt

Lab using freeswitch to talk to OpenAI GPT

# Procedure

1. `answer call`
2. `fork audio to service`
   1. `uses vad to cut the audio`
   2. `send audio fragment to ASR`
   3. `send text to OpenAI GPT`
   4. `send response to TTS`
   4. `playback audio TTS`

# Installation

1. `compile and install deps/mod_audio_fork`
