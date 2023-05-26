# freeswitch-talks-to-gpt

Lab using freeswitch to talk to OpenAI GPT

# Procedure

1. `answer call`
2. `fork audio to service`
   - [X] `uses VAD to split the audio`
   - [X] `send audio fragment to ASR`
   - [X] `send text to OpenAI GPT`
   - [ ] `send response to TTS`
   - [ ] `playback audio TTS`

# Installation

1. `compile and install deps/mod_audio_fork`
