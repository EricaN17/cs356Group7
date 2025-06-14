class ExperimentsConfigFileBuilder {
    constructor(formData) {
        this.SequenceId = formData.SequenceId
        this.NetworkTopologyId = formData.NetworkTopologyId
        this.networkDisruptionprofileId = formData.networkDisruptionprofileId
        this.Video = formData.Video;
        this.Duration = formData.Duration;
        this.Frames_to_Encode = formData.Frames_to_Encode;
        this.FPS = formData.FPS;
        this.ResWidth = formData.ResWidth;
        this.ResHeight = formData.ResHeight;
        this.OutputFile = formData.OutputFile;
        this.Encoder = formData.Encoder;
        this.EncoderType = formData.EncoderType;
        this.Bitrate = formData.Bitrate;
        this.YuvFormat = formData.YuvFormat;
        this.EncoderMode = formData.EncoderMode;
        this.Quality = formData.Quality;
        this.BitDepth = formData.BitDepth;
        this.IntraPeriod = formData.IntraPeriod;
        this.BFrames = formData.BFrames;
    }

    getParametersObject() {
        return {
            Video: this.Video,
            Duration: 	this.Duration,
            Frames_to_Encode: 	this.Frames_to_Encode,
            FPS: 	this.FPS,
            ResWidth: 	this.ResWidth,
            ResHeight: 	this.ResHeight,
            OutputFile: 	this.OutputFile,
            Encoder: 	this.Encoder,
            EncoderType: 	this.EncoderType,
            Bitrate: 	this.Bitrate,
            YuvFormat: 	this.YuvFormat,
            EncoderMode: 	this.EncoderMode,
            Quality: 	this.Quality,
            BitDepth: 	this.BitDepth,
            IntraPeriod:  	this.IntraPeriod ,
            BFrames :  	this.BFrames
        };
    }
}
