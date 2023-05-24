#include <iostream>
#include <opencv2/opencv.hpp>
#include <opencv2/core.hpp>
#include <opencv2/imgcodecs.hpp>
#include <opencv2/highgui.hpp>
#include "lbp.hpp"
#include "precomp.hpp"
#include <opencv2/face.hpp>
#include "face_utils.hpp"
using namespace std;
using namespace cv;

static Mat
histc_(const Mat &src, int minVal = 0, int maxVal = 255, bool normed = false)
{
  Mat result;
  // Establish the number of bins.
  int histSize = maxVal - minVal + 1;
  // Set the ranges.
  float range[] = {static_cast<float>(minVal), static_cast<float>(maxVal + 1)};
  const float *histRange = {range};
  // calc histogram
  calcHist(&src, 1, 0, Mat(), result, 1, &histSize, &histRange, true, false);
  // normalize
  if (normed)
  {
    result /= (int)src.total();
  }
  return result.reshape(1, 1);
}

static Mat histc(InputArray _src, int minVal, int maxVal, bool normed)
{
  Mat src = _src.getMat();
  switch (src.type())
  {
  case CV_8SC1:
    return histc_(Mat_<float>(src), minVal, maxVal, normed);
    break;
  case CV_8UC1:
    return histc_(src, minVal, maxVal, normed);
    break;
  case CV_16SC1:
    return histc_(Mat_<float>(src), minVal, maxVal, normed);
    break;
  case CV_16UC1:
    return histc_(src, minVal, maxVal, normed);
    break;
  case CV_32SC1:
    return histc_(Mat_<float>(src), minVal, maxVal, normed);
    break;
  case CV_32FC1:
    return histc_(src, minVal, maxVal, normed);
    break;
  }
  CV_Error(Error::StsUnmatchedFormats, "This type is not implemented yet.");
}

static Mat spatial_histogram(InputArray _src, int numPatterns,
                             int grid_x, int grid_y, bool /*normed*/)
{
  Mat src = _src.getMat();
  // calculate LBP patch size
  int width = src.cols / grid_x;
  int height = src.rows / grid_y;
  // allocate memory for the spatial histogram
  Mat result = Mat::zeros(grid_x * grid_y, numPatterns, CV_32FC1);
  // return matrix with zeros if no data was given
  if (src.empty())
    return result.reshape(1, 1);
  // initial result_row
  int resultRowIdx = 0;
  // iterate through grid
  for (int i = 0; i < grid_y; i++)
  {
    for (int j = 0; j < grid_x; j++)
    {
      Mat src_cell = Mat(src, Range(i * height, (i + 1) * height), Range(j * width, (j + 1) * width));
      Mat cell_hist = histc(src_cell, 0, (numPatterns - 1), true);
      // copy to the result matrix
      Mat result_row = result.row(resultRowIdx);
      cell_hist.reshape(1, 1).convertTo(result_row, CV_32FC1);
      // increase row count in result matrix
      resultRowIdx++;
    }
  }
  // return result as reshaped feature vector
  return result.reshape(1, 1);
}

int main()
{
  //Open an image
  string image_path = samples::findFile("../rostro.jpg");
  Mat frame = imread(image_path, IMREAD_COLOR);
  image_path = samples::findFile("../original_3.jpeg");
  Mat frame2 = imread(image_path, IMREAD_COLOR);

  if (frame.empty())
  {
    cout << "Could not find the image" << endl;
    return 1;
  }
  // imshow("Display image 1", img);

  int radius = 1;
  int neighbors = 8;
  int grid_x = 8;
  int grid_y = 8;

  // windows
  namedWindow("original", WINDOW_AUTOSIZE);
  namedWindow("lbp", WINDOW_AUTOSIZE);

  // matrices used
  Mat dst;   // image after preprocessing
  Mat lbp;   // lbp image
  Mat dst_2; // image 2 after preprocessing
  Mat lbp_2; // lbp 2 image

  bool running = true;
  while (running)
  {
    cvtColor(frame, dst, COLOR_BGR2GRAY);
    GaussianBlur(dst, dst, Size(7, 7), 5, 3, BORDER_CONSTANT); // tiny bit of smoothing is always a good idea
    // comment the following lines for original size
    // resize(img, img, Size(), 0.5, 0.5);
    // resize(dst, dst, Size(), 0.5, 0.5);

    lbp::ELBP(dst, lbp, radius, neighbors); // use the extended operator

    normalize(lbp, lbp, 0, 255, NORM_MINMAX, CV_8UC1);

    //LBP_2

    cvtColor(frame2, dst_2, COLOR_BGR2GRAY);
    GaussianBlur(dst_2, dst_2, Size(7, 7), 5, 3, BORDER_CONSTANT); // tiny bit of smoothing is always a good idea
    // comment the following lines for original size
    // resize(img, img, Size(), 0.5, 0.5);
    // resize(dst, dst, Size(), 0.5, 0.5);

    lbp::ELBP(dst_2, lbp_2, radius, neighbors); // use the extended operator
    normalize(lbp_2, lbp_2, 0, 255, NORM_MINMAX, CV_8UC1);

    Mat query = spatial_histogram(
        lbp,                                                             /* lbp_image */
        static_cast<int>(std::pow(2.0, static_cast<double>(neighbors))), /* number of possible patterns */
        grid_x,                                                          /* grid size x */
        grid_y,                                                          /* grid size y */
        true /* normed histograms */);

    Mat query_2 = spatial_histogram(
        lbp_2,                                                           /* lbp_2_image */
        static_cast<int>(std::pow(2.0, static_cast<double>(neighbors))), /* number of possible patterns */
        grid_x,                                                          /* grid size x */
        grid_y,                                                          /* grid size y */
        true /* normed histograms */);

    imshow("original", frame);
    imshow("lbp", lbp);
    imshow("lbp2", lbp_2);

    float result = compareHist(query, query_2, HISTCMP_CHISQR); //Cambiar a Chi cuadrada

    printf("the result is: %f", result);

    int key = waitKey(0);

    // exit on escape
    if (key == 'w')
    {
      imwrite("../original.jpg", frame);
      imwrite("../lbp.jpg", lbp);
    }
    else
    {
      running = false;
    }
  }

  return 0;
}
