// exports.createPost = async (req, res) => {
//   const { id } = req.payload;
//   try {
//     cloudinary.uploader.upload(
//       req.file.path,
//       { resource_type: "video" },
//       async (error, result) => {
//         if (result) {
//           // Assuming the returned URL is in result.secure_url
//           let videoUrl = result.secure_url;
//           console.log(videoUrl);
//           // Save the video URL to your database
//           req.body.video = videoUrl;

//           // Create a new post with the updated req.body
//           const video = await Video(req.body);
//           //
//           // Send a success response
//           const response = new Response(
//             true,
//             201,
//             "created successfully",
//             video
//           );
//           // postLogger.info(`New post created - ${id}`);
//           return res.status(response.code).json(response);
//         }
//       }
//     );
//     cloudinary.uploader.upload(
//       req.file.path,
//       { resource_type: "image" },
//       async (error, result) => {
//         if (result) {
//           // Assuming the returned URL is in result.secure_url
//           let imageUrl = result.secure_url;
//           console.log(videoUrl);
//           // Save the video URL to your database
//           req.body.video = video._id;
//           req.body.thumbnail = imageUrl;

//           // Create a new post with the updated req.body
//           const post = await postService.createPost(req.body);
//           //
//           // Send a success response
//           const response = new Response(
//             true,
//             201,
//             "Post created successfully",
//             post
//           );
//           postLogger.info(`New post created - ${id}`);
//           return res.status(response.code).json(response);
//         }
//       }
//     );
//   } catch (err) {
//     const response = new Response(false, 500, "Server Error", err);
//     postLogger.error(`An error occured: ${err} - ${id}`);
//     return res.status(response.code).json(response);
//   }
// };

// exports.createPost = async (req, res) => {
//     try {
//       // Check if any files are provided
//       if (!req.files || Object.keys(req.files).length === 0) {
//         const response = new Response(
//           false,
//           400,
//           "Video and image are required."
//         );
//         return res.status(response.code).json(response);
//       }

//       // Upload video
//       const videoResult = await cloudinary.uploader.upload(
//         req.files.video[0].path,
//         {
//           resource_type: "video",
//         }
//       );
//       const videoUrl = videoResult.secure_url;

//       // Upload image
//       const imageResult = await cloudinary.uploader.upload(
//         req.files.image[0].path,
//         {
//           resource_type: "image",
//         }
//       );
//       const imageUrl = imageResult.secure_url;

//       // Save video to Video collection
//       const video = await Video.create({ url: videoUrl });

//       // Save post with video and image references
//       const post = await postService.createPost({
//         video: video._id,
//         thumbnail: imageUrl,
//         // ...other post properties
//         ...req.body,
//       });

//       const response = new Response(true, 201, "Post created successfully", post);
//       return res.status(response.code).json(response);
//     } catch (err) {
//       const response = new Response(false, 500, "Server Error", err);
//       return res.status(response.code).json(response);
//     }
//   };

// upload.fields([
//     { name: "video", maxCount: 1 },
//     { name: "image", maxCount: 1 },
//   ]),

// Actual Controller
const createProject = asyncHandler(async (req, res) => {
  try {
    if (req.body.title) {
      const baseSlug = slugify(req.body.title.toLowerCase());
      req.body.slug = await findAvailableSlug(Project, baseSlug);
    }

    const uploadPromises = req.files.map((file) => {
      return new Promise((resolve, reject) => {
        cloudinary.uploader.upload(file.path, (error, result) => {
          if (result) {
            resolve(result.secure_url);
          } else {
            reject(error);
          }
        });
      });
    });

    const imageUrls = await Promise.all(uploadPromises);
    req.body.images = imageUrls;
    // req.body.logo = logoUrl;

    const project = await Project.create(req.body);
    res.status(200).json({
      status: true,
      message: "Project Created Successfully",
      project,
    });
  } catch (error) {
    console.error("Error creating Project:", error);
    res.status(500).json({ status: false, message: "Internal Server Error" });
  }
});
