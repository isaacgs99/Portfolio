# CMAKE generated file: DO NOT EDIT!
# Generated by "Unix Makefiles" Generator, CMake Version 3.16

# Delete rule output on recipe failure.
.DELETE_ON_ERROR:


#=============================================================================
# Special targets provided by cmake.

# Disable implicit rules so canonical targets will work.
.SUFFIXES:


# Remove some rules from gmake that .SUFFIXES does not remove.
SUFFIXES =

.SUFFIXES: .hpux_make_needs_suffix_list


# Suppress display of executed commands.
$(VERBOSE).SILENT:


# A target that is always out of date.
cmake_force:

.PHONY : cmake_force

#=============================================================================
# Set environment variables for the build.

# The shell in which to execute make rules.
SHELL = /bin/sh

# The CMake executable.
CMAKE_COMMAND = /usr/bin/cmake

# The command to remove a file.
RM = /usr/bin/cmake -E remove -f

# Escaping for special characters.
EQUALS = =

# The top-level source directory on which CMake was run.
CMAKE_SOURCE_DIR = /home/rojo/Documentos/Git/FeatureExtraction

# The top-level build directory on which CMake was run.
CMAKE_BINARY_DIR = /home/rojo/Documentos/Git/FeatureExtraction/build

# Include any dependencies generated for this target.
include CMakeFiles/my_project.dir/depend.make

# Include the progress variables for this target.
include CMakeFiles/my_project.dir/progress.make

# Include the compile flags for this target's objects.
include CMakeFiles/my_project.dir/flags.make

CMakeFiles/my_project.dir/source/main.cpp.o: CMakeFiles/my_project.dir/flags.make
CMakeFiles/my_project.dir/source/main.cpp.o: ../source/main.cpp
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green --progress-dir=/home/rojo/Documentos/Git/FeatureExtraction/build/CMakeFiles --progress-num=$(CMAKE_PROGRESS_1) "Building CXX object CMakeFiles/my_project.dir/source/main.cpp.o"
	/usr/bin/c++  $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -o CMakeFiles/my_project.dir/source/main.cpp.o -c /home/rojo/Documentos/Git/FeatureExtraction/source/main.cpp

CMakeFiles/my_project.dir/source/main.cpp.i: cmake_force
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green "Preprocessing CXX source to CMakeFiles/my_project.dir/source/main.cpp.i"
	/usr/bin/c++ $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -E /home/rojo/Documentos/Git/FeatureExtraction/source/main.cpp > CMakeFiles/my_project.dir/source/main.cpp.i

CMakeFiles/my_project.dir/source/main.cpp.s: cmake_force
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green "Compiling CXX source to assembly CMakeFiles/my_project.dir/source/main.cpp.s"
	/usr/bin/c++ $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -S /home/rojo/Documentos/Git/FeatureExtraction/source/main.cpp -o CMakeFiles/my_project.dir/source/main.cpp.s

CMakeFiles/my_project.dir/source/lbp.cpp.o: CMakeFiles/my_project.dir/flags.make
CMakeFiles/my_project.dir/source/lbp.cpp.o: ../source/lbp.cpp
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green --progress-dir=/home/rojo/Documentos/Git/FeatureExtraction/build/CMakeFiles --progress-num=$(CMAKE_PROGRESS_2) "Building CXX object CMakeFiles/my_project.dir/source/lbp.cpp.o"
	/usr/bin/c++  $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -o CMakeFiles/my_project.dir/source/lbp.cpp.o -c /home/rojo/Documentos/Git/FeatureExtraction/source/lbp.cpp

CMakeFiles/my_project.dir/source/lbp.cpp.i: cmake_force
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green "Preprocessing CXX source to CMakeFiles/my_project.dir/source/lbp.cpp.i"
	/usr/bin/c++ $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -E /home/rojo/Documentos/Git/FeatureExtraction/source/lbp.cpp > CMakeFiles/my_project.dir/source/lbp.cpp.i

CMakeFiles/my_project.dir/source/lbp.cpp.s: cmake_force
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green "Compiling CXX source to assembly CMakeFiles/my_project.dir/source/lbp.cpp.s"
	/usr/bin/c++ $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -S /home/rojo/Documentos/Git/FeatureExtraction/source/lbp.cpp -o CMakeFiles/my_project.dir/source/lbp.cpp.s

# Object files for target my_project
my_project_OBJECTS = \
"CMakeFiles/my_project.dir/source/main.cpp.o" \
"CMakeFiles/my_project.dir/source/lbp.cpp.o"

# External object files for target my_project
my_project_EXTERNAL_OBJECTS =

my_project: CMakeFiles/my_project.dir/source/main.cpp.o
my_project: CMakeFiles/my_project.dir/source/lbp.cpp.o
my_project: CMakeFiles/my_project.dir/build.make
my_project: /home/rojo/installation/OpenCV-master/lib/libopencv_gapi.so.4.4.0
my_project: /home/rojo/installation/OpenCV-master/lib/libopencv_stitching.so.4.4.0
my_project: /home/rojo/installation/OpenCV-master/lib/libopencv_aruco.so.4.4.0
my_project: /home/rojo/installation/OpenCV-master/lib/libopencv_bgsegm.so.4.4.0
my_project: /home/rojo/installation/OpenCV-master/lib/libopencv_bioinspired.so.4.4.0
my_project: /home/rojo/installation/OpenCV-master/lib/libopencv_ccalib.so.4.4.0
my_project: /home/rojo/installation/OpenCV-master/lib/libopencv_cvv.so.4.4.0
my_project: /home/rojo/installation/OpenCV-master/lib/libopencv_dnn_objdetect.so.4.4.0
my_project: /home/rojo/installation/OpenCV-master/lib/libopencv_dnn_superres.so.4.4.0
my_project: /home/rojo/installation/OpenCV-master/lib/libopencv_dpm.so.4.4.0
my_project: /home/rojo/installation/OpenCV-master/lib/libopencv_face.so.4.4.0
my_project: /home/rojo/installation/OpenCV-master/lib/libopencv_fuzzy.so.4.4.0
my_project: /home/rojo/installation/OpenCV-master/lib/libopencv_hfs.so.4.4.0
my_project: /home/rojo/installation/OpenCV-master/lib/libopencv_img_hash.so.4.4.0
my_project: /home/rojo/installation/OpenCV-master/lib/libopencv_intensity_transform.so.4.4.0
my_project: /home/rojo/installation/OpenCV-master/lib/libopencv_line_descriptor.so.4.4.0
my_project: /home/rojo/installation/OpenCV-master/lib/libopencv_mcc.so.4.4.0
my_project: /home/rojo/installation/OpenCV-master/lib/libopencv_quality.so.4.4.0
my_project: /home/rojo/installation/OpenCV-master/lib/libopencv_rapid.so.4.4.0
my_project: /home/rojo/installation/OpenCV-master/lib/libopencv_reg.so.4.4.0
my_project: /home/rojo/installation/OpenCV-master/lib/libopencv_rgbd.so.4.4.0
my_project: /home/rojo/installation/OpenCV-master/lib/libopencv_saliency.so.4.4.0
my_project: /home/rojo/installation/OpenCV-master/lib/libopencv_stereo.so.4.4.0
my_project: /home/rojo/installation/OpenCV-master/lib/libopencv_structured_light.so.4.4.0
my_project: /home/rojo/installation/OpenCV-master/lib/libopencv_superres.so.4.4.0
my_project: /home/rojo/installation/OpenCV-master/lib/libopencv_surface_matching.so.4.4.0
my_project: /home/rojo/installation/OpenCV-master/lib/libopencv_tracking.so.4.4.0
my_project: /home/rojo/installation/OpenCV-master/lib/libopencv_videostab.so.4.4.0
my_project: /home/rojo/installation/OpenCV-master/lib/libopencv_xfeatures2d.so.4.4.0
my_project: /home/rojo/installation/OpenCV-master/lib/libopencv_xobjdetect.so.4.4.0
my_project: /home/rojo/installation/OpenCV-master/lib/libopencv_xphoto.so.4.4.0
my_project: /home/rojo/installation/OpenCV-master/lib/libopencv_shape.so.4.4.0
my_project: /home/rojo/installation/OpenCV-master/lib/libopencv_highgui.so.4.4.0
my_project: /home/rojo/installation/OpenCV-master/lib/libopencv_datasets.so.4.4.0
my_project: /home/rojo/installation/OpenCV-master/lib/libopencv_plot.so.4.4.0
my_project: /home/rojo/installation/OpenCV-master/lib/libopencv_text.so.4.4.0
my_project: /home/rojo/installation/OpenCV-master/lib/libopencv_dnn.so.4.4.0
my_project: /home/rojo/installation/OpenCV-master/lib/libopencv_ml.so.4.4.0
my_project: /home/rojo/installation/OpenCV-master/lib/libopencv_phase_unwrapping.so.4.4.0
my_project: /home/rojo/installation/OpenCV-master/lib/libopencv_optflow.so.4.4.0
my_project: /home/rojo/installation/OpenCV-master/lib/libopencv_ximgproc.so.4.4.0
my_project: /home/rojo/installation/OpenCV-master/lib/libopencv_video.so.4.4.0
my_project: /home/rojo/installation/OpenCV-master/lib/libopencv_videoio.so.4.4.0
my_project: /home/rojo/installation/OpenCV-master/lib/libopencv_imgcodecs.so.4.4.0
my_project: /home/rojo/installation/OpenCV-master/lib/libopencv_objdetect.so.4.4.0
my_project: /home/rojo/installation/OpenCV-master/lib/libopencv_calib3d.so.4.4.0
my_project: /home/rojo/installation/OpenCV-master/lib/libopencv_features2d.so.4.4.0
my_project: /home/rojo/installation/OpenCV-master/lib/libopencv_flann.so.4.4.0
my_project: /home/rojo/installation/OpenCV-master/lib/libopencv_photo.so.4.4.0
my_project: /home/rojo/installation/OpenCV-master/lib/libopencv_imgproc.so.4.4.0
my_project: /home/rojo/installation/OpenCV-master/lib/libopencv_core.so.4.4.0
my_project: CMakeFiles/my_project.dir/link.txt
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green --bold --progress-dir=/home/rojo/Documentos/Git/FeatureExtraction/build/CMakeFiles --progress-num=$(CMAKE_PROGRESS_3) "Linking CXX executable my_project"
	$(CMAKE_COMMAND) -E cmake_link_script CMakeFiles/my_project.dir/link.txt --verbose=$(VERBOSE)

# Rule to build all files generated by this target.
CMakeFiles/my_project.dir/build: my_project

.PHONY : CMakeFiles/my_project.dir/build

CMakeFiles/my_project.dir/clean:
	$(CMAKE_COMMAND) -P CMakeFiles/my_project.dir/cmake_clean.cmake
.PHONY : CMakeFiles/my_project.dir/clean

CMakeFiles/my_project.dir/depend:
	cd /home/rojo/Documentos/Git/FeatureExtraction/build && $(CMAKE_COMMAND) -E cmake_depends "Unix Makefiles" /home/rojo/Documentos/Git/FeatureExtraction /home/rojo/Documentos/Git/FeatureExtraction /home/rojo/Documentos/Git/FeatureExtraction/build /home/rojo/Documentos/Git/FeatureExtraction/build /home/rojo/Documentos/Git/FeatureExtraction/build/CMakeFiles/my_project.dir/DependInfo.cmake --color=$(COLOR)
.PHONY : CMakeFiles/my_project.dir/depend

