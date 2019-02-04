class EsignController < ApplicationController
  def index
  end

  def generate_pdf
    data_url = params[:dataURL]
    pdf = WickedPdf.new.pdf_from_string(
      render_to_string(
        'signature',
        pdf: 'signature',
        locals: { data_url: data_url }
      )
    )
    save_path = Rails.root.join('pdfs','signature.pdf')
    File.open(save_path, 'wb') do |file|
      file << pdf
    end

    render index
  end
end
