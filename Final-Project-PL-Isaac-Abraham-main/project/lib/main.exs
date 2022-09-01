# Final Project: Image processing: Filters and rotation
# Isaac Garza and Abraham García del Corral
# 2021-12-03

defmodule Image do
  @moduledoc """
  This module contains functions in order to read, manipulate and write 
  data from images.
  """


  @doc """
  Read function receives the path of a file. The file must be a BMP image
  in order to work as spected.
  Once readed returns the binary information of the file.
  """
  def read(path) do
    file = File.open!(path, [:read, :binary])
    _bm = IO.binread(file, :all)
  end


  @doc """
  Gets the list with the image data as argument as well as the name of the
  desired output file. The last one has to incude the bmp extension in order
  to display the image in the correct way
  """
  def write(list, name) do
    file= File.open!(name, [:write])
    IO.binwrite(file, list)
    File.close(file)
  end


  
  # Gets a bitsring as argument and for each value changes or not according to
  # the formula
  defp makeNeg(pixels) do
    _newPixels = for <<i <- pixels >> do
        255 - i
    end
  end


  # Aux function that checks if the value received is greater than 255 or not
  # This function is used by makeSep function
  defp check255?(val) do
      if val > 255 do 
          255
      else
          val
      end
  end


  # Aux function that checks if the value received is zero or not.
  # Used by the mask function
  defp check0?(val) do
      if val < 30 do 
          val
      else
          255
      end
  end


  @doc """
  Receives tuple of R G B values as argument, and then modifies their values
  according to the Sepia formula
  Returns a List with new values
  """
  def makeSep(pixels) do
    newPixels = for {r,g,b} <- pixels do
                  resR = trunc((0.393 * r) + (0.769 * g) + (0.189 * b))
                  resG = trunc((0.349 * r) + (0.686 * g) + (0.168 * b))
                  resB = trunc((0.272 * r) + (0.534 * g) + (0.131 * b))

                  [check255?(resR),check255?(resG),check255?(resB)]
                end
    List.flatten(newPixels)
  end


  @doc """
  Gets a tuple of R G B as argument, and modifies their values according to
  the formula. Returns a List with new values
  """
  def makeBW(pixels) do
    newPixels = for {r,g,b} <- pixels do
                  res = ((0.3 * r) + ( 0.6 * g) + ( 0.1 * b));
                  res2 = trunc(res)
                  res3 = check255?(res2)
                  [res3,res3,res3]
                end
    List.flatten(newPixels)
  end


  @doc """
  Takes a binary as argument, reverse the order of the data, and changes the
  order of the corresponding RGB values.
  Returns a List with the new data.
  """
  def mirror(pixels) do
    revPixels = Enum.reverse(pixels)
    newPixels = for {r,g,b} <- revPixels do
                  [g,b,r]
                end
    List.flatten(newPixels)
  end


  @doc """
  Receives binary data as argument, and for each value, changes the value or
  not according to the check function.
  """
  def mask(pixels) do
    _newPixels = for <<i <- pixels >> do
        check0?(i)
    end
  end


  def main(path) do
    file = read(path)

    # Negative Image
    header = String.slice(file,0..54)
    rest = String.slice(file,54..String.length(file)-1)

    newNegative = makeNeg(rest)

    bin = Enum.into(newNegative,<<>>, fn bit -> <<bit :: 8>> end)

    negBits = <<header::binary, bin::binary>>
    
    write(negBits, "img_neg.bmp")

    # BW Image
    pixels = for <<r::8, g::8, b::8 <- rest>>, do: {r, g, b}

    newBw = makeBW(pixels)

    bin2 = Enum.into(newBw,<<>>, fn bit -> <<bit :: 8>> end)

    bwBits = <<header::binary, bin2::binary>>

    write(bwBits, "img_bw.bmp")

    # Sepia Image

    newSepia = makeSep(pixels)

    bin3 = Enum.into(newSepia,<<>>, fn bit -> <<bit :: 8>> end)

    sepBits = <<header::binary, bin3::binary>>

    write(sepBits, "img_sep.bmp")

    # Mirror Image

    newMirror = mirror(pixels)

    bin4 = Enum.into(newMirror,<<>>, fn bit -> <<bit :: 8>> end)

    mirrBits = <<header::binary, bin4::binary>>

    write(mirrBits, "img_mirror.bmp")

   # Mask Image 

    newMask = mask(bin2)

    bin5 = Enum.into(newMask,<<>>, fn bit -> <<bit :: 8>> end)

    maskBits = <<header::binary, bin5::binary>>

    write(maskBits, "img_mask.bmp")
  end
end
