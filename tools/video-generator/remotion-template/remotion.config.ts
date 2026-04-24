import {Config} from '@remotion/cli/config';

Config.setVideoImageFormat('jpeg');
Config.setPixelFormat('yuv420p');
Config.setCodec('h264');
Config.setCrf(22);
Config.setConcurrency(null);
