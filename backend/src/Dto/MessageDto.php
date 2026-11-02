<?php

namespace App\Dto;

use Symfony\Component\Validator\Constraints as Assert;

class CreateMessageDto
{
    #[Assert\Length(max: 255, maxMessage: "El titulo solo puede tener 255 caracteres")]
    public string $title;

    #[Assert\NotBlank(message: "El mensaje no puede estar vacio")]
    public string $message;
}


class ActualizarMessageDto
{
    public ?string $title = null;

    #[Assert\NotBlank(message: "El mensaje no puede estar vacio")]
    public ?string $message = null;
}
