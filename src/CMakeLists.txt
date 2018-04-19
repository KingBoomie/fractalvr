enable_language(CXX)

set (CMAKE_CXX_STANDARD 11)

find_package (GLEW REQUIRED)
find_package (SDL2 REQUIRED)
find_package (OpenVR REQUIRED)

file(GLOB FRACTALVR_SOURCES
  ${CMAKE_SOURCE_DIR}/include
  *
)

add_definitions (-Dstricmp=strcasecmp)
add_definitions (-Dstrnicmp=strncasecmp)

include_directories (${OPENVR_INCLUDE_DIRS} ${SDL2_INCLUDE_DIRS} ${GLEW_INCLUDE_DIRS} ${CMAKE_SOURCE_DIR}/include)

add_executable(fractalvr ${FRACTALVR_SOURCES})
target_link_libraries (fractalvr -ldl -lGL SDL2 GLEW -lopenvr_api)
set_target_properties(fractalvr PROPERTIES LINKER_LANGUAGE CXX)

install (TARGETS fractalvr DESTINATION ${CMAKE_SOURCE_DIR}/bin)