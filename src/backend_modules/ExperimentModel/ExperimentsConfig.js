// ExperimentConfig.js
import './ExperimentsConfigFileBuilder.js'
class ExperimentConfig {
    constructor({
                    SequenceId,
                    NetworkTopologyId,
                    networkDisruptionProfileId,
                    EncodingParameters
                }) {
        this.SequenceId = SequenceId;
        this.NetworkTopologyId = NetworkTopologyId;
        this.networkDisruptionProfileId = networkDisruptionProfileId;
        this.EncodingParameters = EncodingParameters;
    }
}

export default ExperimentConfig;

class EncodingParameters {
    constructor({
                    Video,
                    Duration,
                    Frames_to_Encode,
                    FPS,
                    ResWidth,
                    ResHeight,
                    OutputFile,
                    Bitrate,
                    YuvFormat,
                    EncoderMode,
                    Quality,
                    BitDepth,
                    IntraPeriod,
                    BFrames
                }) {
        this.Video = Video;
        this.Duration = Duration;
        this.Frames_to_Encode = Frames_to_Encode;
        this.FPS = FPS;
        this.ResWidth = ResWidth;
        this.ResHeight = ResHeight;
        this.OutputFile = OutputFile;
        this.Bitrate = Bitrate;
        this.YuvFormat = YuvFormat;
        this.EncoderMode = EncoderMode;
        this.Quality = Quality;
        this.BitDepth = BitDepth;
        this.IntraPeriod = IntraPeriod;
        this.BFrames = BFrames;
    }

    toObject() {
        return { ...this };
    }
}

