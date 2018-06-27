cmake_minimum_required(VERSION 3.10)

enable_language(CXX)

set (CMAKE_CXX_STANDARD 11)

message(STATUS ${GLM_INCLUDE_DIRS})

find_package (GLEW REQUIRED)
find_package (SDL2 REQUIRED)
find_package (openvr REQUIRED)
find_package (GLM CONFIG REQUIRED)
find_package (OpenGL REQUIRED)


message ("${GLEW_LIBRARY}") 

add_definitions (-Dstricmp=strcasecmp)
add_definitions (-Dstrnicmp=strncasecmp)

# include_directories (${OPENVR_INCLUDE_DIRS} ${SDL2_INCLUDE_DIR} ${GLEW_INCLUDE_DIRS} ${GLM_INCLUDE_DIRS})

add_executable(fractalvr CMainApplication.cpp CGLRenderModel.cpp main.cpp Matrices.cpp)
target_include_directories (fractalvr PRIVATE ${CMAKE_SOURCE_DIR}/include)
target_link_libraries (fractalvr GLEW::GLEW glm SDL2::SDL2 SDL2::SDL2main openvr_api OpenGL32 )
# target_link_libraries(fractalvr PRIVATE
# 	GLEW::GLEW
# 	SDL2::SDL2 SDL2::SDL2main
# 	glm
# 	openvr_api
# 	OpenGL32
# 	)
set_target_properties(fractalvr PROPERTIES LINKER_LANGUAGE CXX)

install (TARGETS fractalvr 
	RUNTIME DESTINATION ${CMAKE_BINARY_DIR}/bin
	LIBRARY DESTINATION ${CMAKE_BINARY_DIR}/bin
	ARCHIVE DESTINATION ${CMAKE_BINARY_DIR}/bin
	)
