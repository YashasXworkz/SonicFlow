import {v2 as cloudinary} from 'cloudinary';
import songModel from '../models/songModel.js';

const addSong = async (req,res) => {
    try{
        //extracting files and uploading to cloudinary
        const name = req.body.name;
        const description = req.body.description;
        const album = req.body.album;
        const audioFile = req.files.audio[0];
        const image = req.files.image[0];
        const audioUpload = await cloudinary.uploader(audioFile.path, {resource_type:"video"});// only 2 types for resource types are there in cloudinary i.e audio and video. so we are storing audio as  video
        const imageUpload = await cloudinary.uploader(imageFile.path, {resource_type:"image"});
        const duration = `${Math.floor(audioUpload.duration/60)}:${Math.floor(audioUpload.duration%60)}`;

        const songdata = {
            name,
            description,
            album,
            image: imageUpload.serure_url,
            file: audioFile.serure_url,
            duration
        }

        const song = songModel(songData);
        await song.save();

        res.json({success:true,message:"Song added"});
        console.log(name,description,album,audioUpload,imageUpload);
    }catch(error){
        res.json({success:false});
    }
    
    
}

const listSong = async (req,res) => {
    try {
        const allSongs = await songModel.find({});
        res.json({success:true, songs: allSongs});
    } catch (error) {
        res.json({success:false});
    }
}

const removeSong = async (req,res) => {
    try {
        await songModel.findByIdAndDelete(req.body.id);
        res.json({success:true,message: "Song removes"});
    } catch (error) {
        res.json({success:false});
    }
}



export {addSong, listSong, removeSong}